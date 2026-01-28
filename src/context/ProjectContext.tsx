import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  type ParentComponent,
  type Accessor,
} from "solid-js";
import { projects as projectData } from "../data";
import type { Category, Language, Library, Project } from "../types/project";

interface ProjectState {
  projects: Accessor<Project[]>;
  filteredProjects: Accessor<Project[]>;
  selectedCategory: Accessor<Category | null>;
  selectedLanguages: Accessor<Language[]>;
  selectedLibraries: Accessor<Library[]>;
  toggleLanguage: (language: Language) => void;
  toggleLibrary: (library: Library) => void;
  toggleCategory: (category: Category) => void;
  clearFilters: () => void;
  activeTags: Accessor<(Category | Language | Library)[]>;
}

const ProjectContext = createContext<ProjectState>();

export const useProjectState = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      "useProjectState must be used within ProjectContextProvider",
    );
  }
  return context;
};

export const ProjectContextProvider: ParentComponent = (props) => {
  const [projects] = createSignal(projectData);
  const [selectedLanguages, setSelectedLanguages] = createSignal<Language[]>(
    [],
  );
  const [selectedLibraries, setSelectedLibraries] = createSignal<Library[]>([]);
  const [selectedCategory, setSelectedCategory] = createSignal<Category | null>(null);

  const filteredProjects = createMemo(() => {
    return projects().filter((project) => {
      if (!project.languages || !project.libraries) {
        return false;
      }

      const categoryMatch =
        selectedCategory() === null ||
        project.category === selectedCategory();

      const languageMatch =
        selectedLanguages().length === 0 ||
        selectedLanguages().every((lang) => project.languages.includes(lang));

      const libraryMatch =
        selectedLibraries().length === 0 ||
        selectedLibraries().every((lib) => project.libraries.includes(lib));

      return languageMatch && libraryMatch && categoryMatch;
    });
  });

  const toggleLanguage = (language: Language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
    );
  };

  const toggleLibrary = (library: Library) => {
    setSelectedLibraries((prev) =>
      prev.includes(library)
        ? prev.filter((l) => l !== library)
        : [...prev, library],
    );
  };

  const toggleCategory = (cat: Category) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedLibraries([]);
    setSelectedCategory(null);
  };

  const activeTags = createMemo(() => [
    ...(selectedCategory() ? [selectedCategory()!] : []),
    ...selectedLanguages(),
    ...selectedLibraries(),
  ]);

  const state: ProjectState = {
    projects,
    filteredProjects,
    selectedCategory,
    selectedLanguages,
    selectedLibraries,
    toggleCategory,
    toggleLanguage,
    toggleLibrary,
    clearFilters,
    activeTags,
  };

  return (
    <ProjectContext.Provider value={state}>
      {props.children}
    </ProjectContext.Provider>
  );
};
