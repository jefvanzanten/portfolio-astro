import { For, type Component } from "solid-js";
import type { Project } from "../../types/project";
import ImageViewModal from "../ImageViewModal/ImageViewModal";
import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./FeaturedProjects.module.css";

type FeaturedProjectsProps = {
  projects: Project[];
};

const FeaturedProjects: Component<FeaturedProjectsProps> = (props) => {
  return (
    <>
      <div
        class={styles["featured-projects-list"]}
        style={{ "--total-cards": props.projects.length }}
      >
        <For each={props.projects}>
          {(project, index) => (
            <ProjectCard
              project={project}
              index={index()}
              priority={index() < 3}
            />
          )}
        </For>
      </div>
      <ImageViewModal />
    </>
  );
};

export default FeaturedProjects;
