import { createSignal, For, Suspense, type Component } from "solid-js";
import FilterMenu, {
  isFilterMenuOpen,
  setIsFilterMenuOpen,
} from "../FilterMenu/FilterMenu";
import FilterTagBar from "../FilterTagBar/FilterTagBar";
import type { Language, Library } from "../../data";
import ProjectCard from "../ProjectCard/ProjectCard";
import useProjects from "../../hooks/useProjects";
import { ProjectContextProvider } from "../../context/ProjectProvider";
import styles from "./ProjectPage.module.css";

const ProjectPage: Component = () => {
  const {
    filteredProjects,
    selectedLanguages,
    selectedLibraries,
    toggleLanguage,
    toggleLibrary,
    activeTags,
  } = useProjects();

  return (
    <ProjectContextProvider>
      <main>
        <div class={styles["content-container"]}>
          <section class={styles["filter-container"]}>
            <button
              onClick={() => {
                setIsFilterMenuOpen(!isFilterMenuOpen());
                console.log(isFilterMenuOpen());
              }}
            >
              {isFilterMenuOpen() ? "Close Filters" : "Open Filters"}
            </button>
            {activeTags().length > 0 ? (
              <FilterTagBar
                tags={activeTags()}
                onTagClick={(tag) => {
                  if (selectedLanguages().includes(tag as Language)) {
                    toggleLanguage(tag as Language);
                  } else {
                    toggleLibrary(tag as Library);
                  }
                }}
              />
            ) : null}
          </section>
          <FilterMenu
            selectedLanguages={selectedLanguages()}
            selectedLibraries={selectedLibraries()}
            toggleLanguage={toggleLanguage}
            toggleLibrary={toggleLibrary}
          />
          <section class={styles["project-container"]}>
            <For each={filteredProjects()}>
              {(project) => <ProjectCard project={project} />}
            </For>
          </section>
        </div>
      </main>
    </ProjectContextProvider>
  );
};

export default ProjectPage;
