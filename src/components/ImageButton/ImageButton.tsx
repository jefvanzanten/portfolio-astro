import styles from "./ImageButton.module.css";
import { useImageViewModal } from "../../hooks/useImageViewModal";
import type { Project } from "../../types/project";

const ImageButton = ({ project }: { project: Project }) => {
  const { openModal, setImageUrl } = useImageViewModal();

  const handleImageClick = () => {
    setImageUrl(project.coverUrl);
    openModal();
  };

  return (
    <button onClick={handleImageClick} class={styles["image-container"]}>
      <img
        class={styles.thumb}
        src={project.thumbUrl}
        alt={`${project.name} cover`}
        loading="lazy"
      />
    </button>
  );
};

export default ImageButton;
