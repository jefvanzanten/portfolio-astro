<script lang="ts">
  import { onMount } from "svelte";

  type Props = {
    rootId: string;
  };

  let { rootId }: Props = $props();

  onMount(() => {
    const root = document.getElementById(rootId);
    const track = root?.querySelector<HTMLElement>(".featured-projects-list");
    const slides = Array.from(
      root?.querySelectorAll<HTMLElement>(".carousel-slide") ?? [],
    );
    const dots = Array.from(
      root?.querySelectorAll<HTMLAnchorElement>(".carousel-dot") ?? [],
    );

    if (!root || !track || slides.length === 0 || dots.length !== slides.length) {
      return;
    }

    const carouselTrack = track;
    let animationFrameId: number | undefined;

    /**
     * Updates the visual and accessible active state.
     * @param activeIndex Index of the active slide.
     * @returns Nothing.
     */
    function setActiveSlide(activeIndex: number): void {
      slides.forEach((slide, index) => {
        slide.dataset.position =
          index < activeIndex
            ? "before"
            : index > activeIndex
              ? "after"
              : "active";
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.dataset.active = String(isActive);

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    /**
     * Scrolls a slide to the appropriate desktop or mobile alignment.
     * @param index Index of the destination slide.
     * @param behavior Scroll animation behavior.
     * @returns Nothing.
     */
    function scrollToSlide(index: number, behavior: ScrollBehavior): void {
      const slide = slides[index];
      const slideStart = slide.offsetLeft - carouselTrack.offsetLeft;
      const alignmentOffset = (carouselTrack.clientWidth - slide.offsetWidth) / 2;

      carouselTrack.scrollTo({
        left: slideStart - alignmentOffset,
        behavior,
      });
    }

    /**
     * Marks the slide nearest to the horizontal center as active.
     * @returns Nothing.
     */
    function updateActiveSlide(): void {
      const trackCenter = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
      let activeIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter =
          slide.offsetLeft - carouselTrack.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - trackCenter);

        if (distance < smallestDistance) {
          activeIndex = index;
          smallestDistance = distance;
        }
      });

      setActiveSlide(activeIndex);
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

    const dotClickHandlers = dots.map((dot, index) => {
      /**
       * Activates and centers the slide belonging to the selected marker.
       * @param event Marker click event.
       * @returns Nothing.
       */
      function handleDotClick(event: MouseEvent): void {
        event.preventDefault();
        setActiveSlide(index);

        scrollToSlide(
          index,
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        );
      }

      dot.addEventListener("click", handleDotClick);
      return handleDotClick;
    });

    carouselTrack.addEventListener("scroll", scheduleActiveSlideUpdate, {
      passive: true,
    });

    window.requestAnimationFrame(updateActiveSlide);

    /**
     * Removes listeners and a pending animation frame when the island unmounts.
     * @returns Nothing.
     */
    function cleanup(): void {
      carouselTrack.removeEventListener("scroll", scheduleActiveSlideUpdate);
      dots.forEach((dot, index) => {
        dot.removeEventListener("click", dotClickHandlers[index]);
      });

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    }

    return cleanup;
  });
</script>
