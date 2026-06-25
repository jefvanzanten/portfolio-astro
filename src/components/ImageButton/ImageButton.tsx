import styles from "./ImageButton.module.css";
import { useImageViewModal } from "../../hooks/useImageViewModal";
import type { Project } from "../../types/project";
import { createSignal, onMount } from "solid-js";

const ImageButton = ({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) => {
  const { openModal, setImageUrl } = useImageViewModal();
  const [isLoaded, setIsLoaded] = createSignal(false);
  let imageRef: HTMLImageElement | undefined;

  onMount(() => {
    if (imageRef?.complete) {
      setIsLoaded(true);
    }
  });

  const handleImageClick = () => {
    setImageUrl(project.coverUrl);
    openModal();
  };

  return (
    <button
      onClick={handleImageClick}
      class={styles["image-container"]}
      data-loaded={isLoaded() ? "true" : "false"}
      aria-label={`Open screenshot van ${project.name}`}
    >
      <span class={styles.loader} aria-hidden="true"></span>
      <img
        ref={imageRef}
        class={styles.thumb}
        src={project.thumbUrl}
        alt={`${project.name} cover`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
    </button>
  );
};

export default ImageButton;
