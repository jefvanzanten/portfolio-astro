import { For, type Component } from "solid-js";
import FilterMenu from "../FilterMenu/FilterMenu";
import FilterTagBar from "../FilterTagBar/FilterTagBar";
import ProjectCard from "../ProjectCard/ProjectCard";
import {
  ProjectContextProvider,
  useProjectState,
} from "../../context/ProjectContext";
import styles from "./ProjectPage.module.css";
import FilterButton from "../FilterButton/FilterButton";
import type { Project } from "../../types/project";
import ImageViewModal from "../ImageViewModal/ImageViewModal";

type ProjectPageProps = {
  projects: Project[];
};

const ProjectPageContent: Component<ProjectPageProps> = (props) => {
  const { filteredProjects } = useProjectState();

  return (
    <main>
      <div class={styles["content-container"]}>
        <div class={styles["filter-container"]}>
          <FilterButton />
          <FilterTagBar />
        </div>
        <FilterMenu />
        <ImageViewModal />
        <section
          class={styles["project-container"]}
          style={{ "--total-cards": props.projects.length }}
        >
          <For each={filteredProjects()}>
            {(project, index) => (
              <ProjectCard project={project} index={index()} />
            )}
          </For>
        </section>
      </div>
    </main>
  );
};

const ProjectPage: Component<ProjectPageProps> = (props) => {
  return (
    <ProjectContextProvider projects={props.projects}>
      <ProjectPageContent projects={props.projects} />
    </ProjectContextProvider>
  );
};

export default ProjectPage;
