import styles from "./ImageViewModal.module.css";
import { useImageViewModal } from "../../hooks/useImageViewModal";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";

const MOBILE_BREAKPOINT = 940;

const ImageViewModal: Component = () => {
  const modal = useImageViewModal();
  const [naturalSize, setNaturalSize] = createSignal({ width: 0, height: 0 });
  const [viewport, setViewport] = createSignal({
    width: 0,
    height: 0,
    isMobileLandscape: false,
  });

  const syncViewport = () => {
    if (typeof window === "undefined") {
      return;
    }

    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    setViewport({
      width,
      height,
      isMobileLandscape: width <= MOBILE_BREAKPOINT && isLandscape,
    });
  };

  const handleImageLoad = (event: Event) => {
    const image = event.currentTarget as HTMLImageElement;
    setNaturalSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  };

  const presentation = createMemo(() => {
    const { width: naturalWidth, height: naturalHeight } = naturalSize();
    const { width: viewportWidth, height: viewportHeight, isMobileLandscape } =
      viewport();

    if (
      naturalWidth <= 0 ||
      naturalHeight <= 0 ||
      viewportWidth <= 0 ||
      viewportHeight <= 0
    ) {
      return {
        rotate: false,
        width: 0,
        height: 0,
      };
    }

    const rotate = isMobileLandscape && naturalHeight > naturalWidth;
    const maxWidth = viewportWidth * (viewportWidth <= MOBILE_BREAKPOINT ? 0.94 : 0.92);
    const maxHeight = viewportHeight * (viewportWidth <= MOBILE_BREAKPOINT ? 0.84 : 0.88);

    const scale = rotate
      ? Math.min(maxWidth / naturalHeight, maxHeight / naturalWidth, 1)
      : Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);

    return {
      rotate,
      width: Math.max(1, Math.round(naturalWidth * scale)),
      height: Math.max(1, Math.round(naturalHeight * scale)),
    };
  });

  const mediaStyle = createMemo(() => {
    const current = presentation();
    const style: Record<string, string> = {
      width: `${current.width}px`,
      height: `${current.height}px`,
    };

    if (current.rotate) {
      style.position = "absolute";
      style.top = "50%";
      style.left = "50%";
      style.transform = "translate(-50%, -50%) rotate(90deg)";
    }

    return style;
  });

  createEffect(() => {
    modal.imageUrl();
    setNaturalSize({ width: 0, height: 0 });
  });

  onMount(() => {
    syncViewport();
    window.addEventListener("resize", syncViewport);
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", syncViewport);
    }
  });

  return (
    <dialog ref={modal.setDialog} id="modal" class={styles.dialog}>
      <div class={styles.frame}>
        <div
          class={styles.media}
          classList={{ [styles["media-rotated"]]: presentation().rotate }}
          style={mediaStyle()}
        >
          <header class={styles.header}>
            <a
              href="#"
              class={styles["close-button"]}
              classList={{
                [styles["close-button-rotated"]]: presentation().rotate,
              }}
              title="close"
              onClick={() => modal.closeModal()}
            >
              X
            </a>
          </header>
          <img
            src={modal.imageUrl()}
            class={styles.image}
            alt="Project cover"
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ImageViewModal;
