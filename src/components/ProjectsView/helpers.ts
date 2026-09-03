import type { Category } from "../../types/project";
import type { ProjectFilterState, ProjectFilterable } from "./types";

const categoryOrder: Category[] = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile",
  "Desktop",
];

/**
 * Returns the project categories that occur in the supplied projects.
 *
 * @param projects - Projects from which to derive categories.
 * @returns Available categories in the preferred display order.
 */
export function getAvailableCategories<T extends ProjectFilterable>(
  projects: T[],
): Category[] {
  return categoryOrder.filter((category) =>
    projects.some((project) => project.category === category),
  );
}

/**
 * Returns languages belonging to projects in the selected category.
 *
 * @param projects - Projects from which to derive languages.
 * @param category - Currently selected category, or null for every category.
 * @returns Sorted list of available languages.
 */
export function getAvailableLanguages<T extends ProjectFilterable>(
  projects: T[],
  category: Category | null,
): string[] {
  const relevantProjects = category
    ? projects.filter((project) => project.category === category)
    : projects;

  return [
    ...new Set(relevantProjects.flatMap((project) => project.languages)),
  ].sort();
}

/**
 * Returns libraries belonging to projects matching the upstream filters.
 *
 * @param projects - Projects from which to derive libraries.
 * @param category - Currently selected category, or null for every category.
 * @param language - Currently selected language, or null for every language.
 * @returns Sorted list of available frameworks and libraries.
 */
export function getAvailableLibraries<T extends ProjectFilterable>(
  projects: T[],
  category: Category | null,
  language: string | null,
): string[] {
  const relevantProjects = projects.filter((project) => {
    const matchesCategory = !category || project.category === category;
    const matchesLanguage = !language || project.languages.includes(language);

    return matchesCategory && matchesLanguage;
  });

  return [
    ...new Set(relevantProjects.flatMap((project) => project.libraries)),
  ].sort();
}

/**
 * Determines whether a project satisfies all active filters.
 *
 * @param project - Project to test.
 * @param filters - Currently active filters.
 * @returns True when the project matches the category, language, and every library.
 */
export function matchesProject(
  project: ProjectFilterable,
  filters: ProjectFilterState,
): boolean {
  const matchesCategory =
    !filters.category || project.category === filters.category;
  const matchesLanguage =
    !filters.language || project.languages.includes(filters.language);
  const matchesLibraries = filters.libraries.every((library) =>
    project.libraries.includes(library),
  );

  return matchesCategory && matchesLanguage && matchesLibraries;
}

/**
 * Filters projects using the active project filters.
 *
 * @param projects - Projects to filter.
 * @param filters - Currently active filters.
 * @returns Projects that satisfy all active filters.
 */
export function filterProjects<T extends ProjectFilterable>(
  projects: T[],
  filters: ProjectFilterState,
): T[] {
  return projects.filter((project) => matchesProject(project, filters));
}

/**
 * Builds a projects URL containing the active filter query parameters.
 *
 * @param pathname - Current URL pathname.
 * @param hash - Current URL hash.
 * @param filters - Currently active filters.
 * @returns URL containing the serialized filter state.
 */
export function buildProjectsUrl(
  pathname: string,
  hash: string,
  filters: ProjectFilterState,
): string {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.language) {
    params.set("language", filters.language);
  }

  filters.libraries.forEach((value) => params.append("library", value));

  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}
