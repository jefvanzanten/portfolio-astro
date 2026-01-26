import { createContext, useContext, type ParentComponent } from "solid-js";
import { projects as projectData, type Project } from "../data";

interface ProjectState {
  projects: Project[];
}

const ProjectContext = createContext<ProjectState>({ projects: [] });

export const useProjectState = () => useContext(ProjectContext);

export const ProjectContextProvider: ParentComponent = (props) => {
  const state: ProjectState = { projects: projectData };

  return (
    <ProjectContext.Provider value={state}>
      {props.children}
    </ProjectContext.Provider>
  );
};
