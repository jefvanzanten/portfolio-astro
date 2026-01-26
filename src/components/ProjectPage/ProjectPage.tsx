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
        <section class={styles["project-container"]}>
          <For each={filteredProjects()}>
            {(project) => <ProjectCard project={project} />}
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
