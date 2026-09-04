<script lang="ts">
  import { onMount } from "svelte";

  type Alignment = "center" | "start";

  type Props = {
    rootId: string;
    initialSlideIndex?: number;
    mobileInitialSlideIndex?: number;
    alignment?: Alignment;
    mobileAlignment?: Alignment;
    mobileBreakpoint?: number;
  };

  let {
    rootId,
    initialSlideIndex = 0,
    mobileInitialSlideIndex = initialSlideIndex,
    alignment = "center",
    mobileAlignment = alignment,
    mobileBreakpoint = 640,
  }: Props = $props();

  onMount(() => {
    const root = document.getElementById(rootId);
    const track = root?.querySelector<HTMLElement>("[data-snap-track]");
    const slides = Array.from(
      root?.querySelectorAll<HTMLElement>("[data-snap-item]") ?? [],
    );
    const markers = Array.from(
      root?.querySelectorAll<HTMLAnchorElement>("[data-snap-marker]") ?? [],
    );
    const previousButton =
      root?.querySelector<HTMLButtonElement>("[data-snap-previous]");
    const nextButton = root?.querySelector<HTMLButtonElement>("[data-snap-next]");
    const currentCounter = root?.querySelector<HTMLElement>("[data-snap-current]");
    const totalCounter = root?.querySelector<HTMLElement>("[data-snap-total]");
    const hasCounterNavigation = Boolean(
      previousButton && nextButton && currentCounter && totalCounter,
    );

    if (
      !root ||
      !track ||
      slides.length === 0 ||
      (markers.length !== slides.length && !hasCounterNavigation)
    ) {
      return;
    }

    const carouselTrack = track;
    let activeIndex = -1;
    let animationFrameId: number | undefined;

    /**
     * Returns the alignment used at the current viewport width.
     * @returns The current slide alignment.
     */
    function getAlignment(): Alignment {
      return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches
        ? mobileAlignment
        : alignment;
    }

    /**
     * Returns the indices of slides that have not been filtered out.
     * @returns Visible slide indices.
     */
    function getVisibleIndices(): number[] {
      return slides.flatMap((slide, index) => (slide.hidden ? [] : [index]));
    }

    /**
     * Updates the visual and accessible active state.
     * @param nextActiveIndex - Index of the active slide.
     * @returns Nothing.
     */
    function setActiveSlide(nextActiveIndex: number): void {
      activeIndex = nextActiveIndex;

      slides.forEach((slide, index) => {
        if (slide.hidden) {
          delete slide.dataset.position;
          return;
        }

        slide.dataset.position =
          index < nextActiveIndex
            ? "before"
            : index > nextActiveIndex
              ? "after"
              : "active";
      });

      markers.forEach((marker, index) => {
        const isVisible = !slides[index].hidden;
        const isActive = isVisible && index === nextActiveIndex;
        marker.hidden = !isVisible;
        marker.dataset.active = String(isActive);

        if (isActive) {
          marker.setAttribute("aria-current", "true");
        } else {
          marker.removeAttribute("aria-current");
        }
      });

      const visibleIndices = getVisibleIndices();
      const visiblePosition = visibleIndices.indexOf(nextActiveIndex);

      if (currentCounter && totalCounter && previousButton && nextButton) {
        currentCounter.textContent = String(visiblePosition + 1);
        totalCounter.textContent = String(visibleIndices.length);
        previousButton.disabled = visiblePosition <= 0;
        nextButton.disabled =
          visiblePosition < 0 || visiblePosition >= visibleIndices.length - 1;
      }
    }

    /**
     * Scrolls a slide to the configured alignment.
     * @param index - Index of the destination slide.
     * @param behavior - Scroll animation behavior.
     * @returns Nothing.
     */
    function scrollToSlide(index: number, behavior: ScrollBehavior): void {
      const slide = slides[index];
      const slideStart = slide.offsetLeft - carouselTrack.offsetLeft;
      const alignmentOffset =
        getAlignment() === "center"
          ? (carouselTrack.clientWidth - slide.offsetWidth) / 2
          : 0;

      carouselTrack.scrollTo({
        left: slideStart - alignmentOffset,
        behavior,
      });
    }

    /**
     * Finds and marks the visible slide nearest to the alignment point.
     * @returns Nothing.
     */
    function updateActiveSlide(): void {
      const alignmentPoint =
        carouselTrack.scrollLeft +
        (getAlignment() === "center" ? carouselTrack.clientWidth / 2 : 0);
      let nextActiveIndex = getVisibleIndices()[0] ?? -1;
      let smallestDistance = Number.POSITIVE_INFINITY;

      getVisibleIndices().forEach((index) => {
        const slide = slides[index];
        const slidePoint =
          slide.offsetLeft -
          carouselTrack.offsetLeft +
          (getAlignment() === "center" ? slide.offsetWidth / 2 : 0);
        const distance = Math.abs(slidePoint - alignmentPoint);

        if (distance < smallestDistance) {
          nextActiveIndex = index;
          smallestDistance = distance;
        }
      });

      setActiveSlide(nextActiveIndex);
      animationFrameId = undefined;
    }

    /**
     * Limits active-state calculations to one update per animation frame.
     * @returns Nothing.
     */
    function scheduleActiveSlideUpdate(): void {
      if (animationFrameId !== undefined) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateActiveSlide);
    }

    /**
     * Synchronizes markers and position after slides are filtered.
     * @returns Nothing.
     */
    function handleSlideVisibilityChange(): void {
      const visibleIndices = getVisibleIndices();
      const nextIndex = visibleIndices.includes(activeIndex)
        ? activeIndex
        : (visibleIndices[0] ?? -1);

      setActiveSlide(nextIndex);

      if (nextIndex >= 0) {
        scrollToSlide(nextIndex, "auto");
      }
    }

    const markerClickHandlers = markers.map((marker, index) => {
      /**
       * Activates and scrolls to the slide belonging to a marker.
       * @param event - Marker click event.
       * @returns Nothing.
       */
      function handleMarkerClick(event: MouseEvent): void {
        event.preventDefault();
        setActiveSlide(index);
        scrollToSlide(
          index,
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        );
      }

      marker.addEventListener("click", handleMarkerClick);
      return handleMarkerClick;
    });

    /**
     * Moves to the adjacent visible slide.
     * @param direction - Offset from the active visible slide.
     * @returns Nothing.
     */
    function navigateBy(direction: -1 | 1): void {
      const visibleIndices = getVisibleIndices();
      const currentPosition = visibleIndices.indexOf(activeIndex);
      const nextIndex = visibleIndices[currentPosition + direction];

      if (nextIndex === undefined) {
        return;
      }

      setActiveSlide(nextIndex);
      scrollToSlide(
        nextIndex,
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      );
    }

    /**
     * Moves to the previous visible slide.
     * @returns Nothing.
     */
    function handlePreviousClick(): void {
      navigateBy(-1);
    }

    /**
     * Moves to the next visible slide.
     * @returns Nothing.
     */
    function handleNextClick(): void {
      navigateBy(1);
    }

    previousButton?.addEventListener("click", handlePreviousClick);
    nextButton?.addEventListener("click", handleNextClick);

    const visibilityObserver = new MutationObserver(handleSlideVisibilityChange);
    slides.forEach((slide) => {
      visibilityObserver.observe(slide, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    });

    carouselTrack.addEventListener("scroll", scheduleActiveSlideUpdate, {
      passive: true,
    });

    // Temporary fallback until CSS scroll markers and scroll-target navigation
    // are broadly supported. Initial positioning can then be owned by CSS too.
    window.requestAnimationFrame(() => {
      const requestedIndex = window.matchMedia(
        `(max-width: ${mobileBreakpoint}px)`,
      ).matches
        ? mobileInitialSlideIndex
        : initialSlideIndex;
      const visibleIndices = getVisibleIndices();
      const nextIndex = visibleIndices.includes(requestedIndex)
        ? requestedIndex
        : (visibleIndices[0] ?? -1);

      if (nextIndex >= 0) {
        setActiveSlide(nextIndex);
        scrollToSlide(nextIndex, "auto");
      }
    });

    /**
     * Removes listeners, observers, and pending animation work.
     * @returns Nothing.
     */
    function cleanup(): void {
      carouselTrack.removeEventListener("scroll", scheduleActiveSlideUpdate);
      visibilityObserver.disconnect();
      markers.forEach((marker, index) => {
        marker.removeEventListener("click", markerClickHandlers[index]);
      });
      previousButton?.removeEventListener("click", handlePreviousClick);
      nextButton?.removeEventListener("click", handleNextClick);

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    }

    return cleanup;
  });
</script>
