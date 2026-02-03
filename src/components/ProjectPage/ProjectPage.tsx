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
import { projects } from "../../data";

const ProjectPageContent: Component = () => {
  const { filteredProjects } = useProjectState();

  return (
    <main>
      <div class={styles["content-container"]}>
        <div class={styles["filter-container"]}>
          <FilterButton />
          <FilterTagBar />
        </div>
        <FilterMenu />
        <section
          class={styles["project-container"]}
          style={{ "--total-cards": projects.length }}
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

const ProjectPage: Component = () => {
  return (
    <ProjectContextProvider>
      <ProjectPageContent />
    </ProjectContextProvider>
  );
};

export default ProjectPage;
