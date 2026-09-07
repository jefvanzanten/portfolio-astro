import type { Category } from "../../types/project";
import type {
  ProjectFilterOption,
  ProjectFilterState,
  ProjectFilterable,
} from "./types";

/**
 * Counts projects per filter value and orders the values by descending count.
 *
 * @param projects - Projects from which to derive options.
 * @param getValues - Returns the filter values belonging to one project.
 * @returns Filter options ordered by count and then alphabetically.
 */
function createFilterOptions<
  T extends ProjectFilterable,
  Value extends string,
>(
  projects: T[],
  getValues: (project: T) => readonly Value[],
): ProjectFilterOption<Value>[] {
  const counts = new Map<Value, number>();

  projects.forEach((project) => {
    new Set(getValues(project)).forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort(
      (optionA, optionB) =>
        optionB.count - optionA.count ||
        optionA.value.localeCompare(optionB.value),
    );
}

/**
 * Extracts values from filter options.
 *
 * @param options - Filter options whose values should be extracted.
 * @returns Filter option values in their current order.
 */
export function getOptionValues<Value extends string>(
  options: ProjectFilterOption<Value>[],
): Value[] {
  return options.map((option) => option.value);
}

/**
 * Converts filter options to a lookup containing their project counts.
 *
 * @param options - Filter options to convert.
 * @returns Project count indexed by filter value.
 */
export function getOptionCounts<Value extends string>(
  options: ProjectFilterOption<Value>[],
): Partial<Record<Value, number>> {
  return Object.fromEntries(
    options.map((option) => [option.value, option.count]),
  ) as Partial<Record<Value, number>>;
}

/**
 * Searches filter options by their value.
 *
 * @param options - Filter options to search.
 * @param search - Search phrase to match case-insensitively.
 * @returns Filter options whose values contain the search phrase.
 */
export function searchOptions<Value extends string>(
  options: ProjectFilterOption<Value>[],
  search: string,
): ProjectFilterOption<Value>[] {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  return options.filter((option) =>
    option.value.toLocaleLowerCase().includes(normalizedSearch),
  );
}

/**
 * Returns the project categories that occur in the supplied projects.
 *
 * @param projects - Projects from which to derive categories.
 * @returns Available categories with project counts, ordered by descending count.
 */
export function getAvailableCategories<T extends ProjectFilterable>(
  projects: T[],
): ProjectFilterOption<Category>[] {
  return createFilterOptions(projects, (project) => [project.category]);
}

/**
 * Returns languages belonging to projects in the selected category.
 *
 * @param projects - Projects from which to derive languages.
 * @param category - Currently selected category, or null for every category.
 * @returns Available languages with project counts, ordered by descending count.
 */
export function getAvailableLanguages<T extends ProjectFilterable>(
  projects: T[],
  category: Category | null,
): ProjectFilterOption[] {
  const relevantProjects = category
    ? projects.filter((project) => project.category === category)
    : projects;

  return createFilterOptions(relevantProjects, (project) => project.languages);
}

/**
 * Returns libraries belonging to projects matching the upstream filters.
 *
 * @param projects - Projects from which to derive libraries.
 * @param category - Currently selected category, or null for every category.
 * @param language - Currently selected language, or null for every language.
 * @returns Available libraries with project counts, ordered by descending count.
 */
export function getAvailableLibraries<T extends ProjectFilterable>(
  projects: T[],
  category: Category | null,
  language: string | null,
): ProjectFilterOption[] {
  const relevantProjects = projects.filter((project) => {
    const matchesCategory = !category || project.category === category;
    const matchesLanguage = !language || project.languages.includes(language);

    return matchesCategory && matchesLanguage;
  });

  return createFilterOptions(relevantProjects, (project) => project.libraries);
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
