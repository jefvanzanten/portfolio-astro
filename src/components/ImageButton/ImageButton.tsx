import styles from "./ImageButton.module.css";
import { useImageViewModal } from "../../hooks/useImageViewModal";
import type { Project } from "../../data";

const ImageButton = ({ project }: { project: Project }) => {
  const { openModal, setImageUrl } = useImageViewModal();

  const handleImageClick = () => {
    setImageUrl(project.coverUrl);
    openModal();
  };

  return (
    <button onClick={handleImageClick} class={styles.imgContainer}>
      <img
        class={styles.cover}
        src={project.thumbUrl}
        alt={`${project.name} cover`}
        loading="lazy"
      />
    </button>
  );
};

export default ImageButton;
