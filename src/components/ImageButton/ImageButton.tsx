import type { Component } from "solid-js";
import styles from "./ImageButton.module.css";
import { useImageViewModal } from "../../hooks/useImageViewModal";
import type { Project } from "../../data";

const ImageButton = ({ project }: { project: Project }) => {
  console.log("ImageButton component hydrated!", project.name);
  const { openModal, setImageUrl } = useImageViewModal();

  const handleImageClick = () => {
    console.log("imagebutton pressed");
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
