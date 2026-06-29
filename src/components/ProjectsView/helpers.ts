import type { ProjectFilterState, ProjectViewModel } from "./types";

const categoryOrder = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile",
  "Desktop",
] as const;

const matchesAll = (selectedValues: string[], availableValues: string[]) =>
  selectedValues.every((value) => availableValues.includes(value));

export function getProjectFilterOptions(projects: ProjectViewModel[]) {
  return {
    categories: categoryOrder.filter((category) =>
      projects.some((project) => project.category === category),
    ),
    languages: [...new Set(projects.flatMap((project) => project.languages))].sort(),
    libraries: [...new Set(projects.flatMap((project) => project.libraries))].sort(),
  };
}

export function filterProjects(
  projects: ProjectViewModel[],
  filters: ProjectFilterState,
) {
  return projects.filter((project) => {
    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(project.category);
    const matchesLanguages = matchesAll(filters.languages, project.languages);
    const matchesLibraries = matchesAll(filters.libraries, project.libraries);

    return matchesCategory && matchesLanguages && matchesLibraries;
  });
}

export function buildProjectsUrl(
  pathname: string,
  hash: string,
  filters: ProjectFilterState,
) {
  const params = new URLSearchParams();

  filters.categories.forEach((value) => params.append("category", value));
  filters.languages.forEach((value) => params.append("language", value));
  filters.libraries.forEach((value) => params.append("library", value));

  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}
