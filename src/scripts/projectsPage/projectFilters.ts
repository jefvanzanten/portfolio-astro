const FILTER_FORM_SELECTOR = "[data-filter-form]";
const FILTER_PANEL_SELECTOR = "[data-filter-panel]";
const FILTER_TOGGLE_SELECTOR = "[data-filter-toggle]";
const PROJECT_CARD_SELECTOR = "[data-project-card]";
const EMPTY_STATE_SELECTOR = "[data-project-empty]";

type FilterName = "category" | "language" | "library";

const matchesAll = (selectedValues: string[], availableValues: string[]) =>
  selectedValues.every((value) => availableValues.includes(value));

const readDatasetList = (element: HTMLElement, key: "languages" | "libraries") =>
  (element.dataset[key] ?? "").split(",").filter(Boolean);

export const createProjectFilterController = (root: HTMLElement) => {
  const form = root.querySelector(FILTER_FORM_SELECTOR);
  const filterPanel = root.querySelector(FILTER_PANEL_SELECTOR);
  const filterToggle = root.querySelector(FILTER_TOGGLE_SELECTOR);
  const emptyState = root.querySelector(EMPTY_STATE_SELECTOR);
  const cards = Array.from(root.querySelectorAll(PROJECT_CARD_SELECTOR)).filter(
    (card): card is HTMLElement => card instanceof HTMLElement,
  );

  const readCheckedValues = (name: FilterName) => {
    if (!(form instanceof HTMLFormElement)) {
      return [];
    }

    return Array.from(
      form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`),
    ).map((input) => input.value);
  };

  const updateUrl = (
    categories: string[],
    languages: string[],
    libraries: string[],
  ) => {
    const params = new URLSearchParams();

    categories.forEach((value) => params.append("category", value));
    languages.forEach((value) => params.append("language", value));
    libraries.forEach((value) => params.append("library", value));

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const setFilterPanelOpen = (open: boolean) => {
    if (!(filterPanel instanceof HTMLElement)) {
      return;
    }

    filterPanel.hidden = !open;
    root.dataset.filtersOpen = open ? "true" : "false";

    if (filterToggle instanceof HTMLButtonElement) {
      filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
      filterToggle.textContent = open ? "Verberg filters" : "Toon filters";
    }
  };

  const applyFilters = () => {
    const categories = readCheckedValues("category");
    const languages = readCheckedValues("language");
    const libraries = readCheckedValues("library");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category ?? "";
      const projectLanguages = readDatasetList(card, "languages");
      const projectLibraries = readDatasetList(card, "libraries");

      const matchesCategory =
        categories.length === 0 || categories.includes(category);
      const matchesLanguages = matchesAll(languages, projectLanguages);
      const matchesLibraries = matchesAll(libraries, projectLibraries);
      const matches = matchesCategory && matchesLanguages && matchesLibraries;

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = visibleCount !== 0;
    }

    updateUrl(categories, languages, libraries);
  };

  const init = () => {
    if (form instanceof HTMLFormElement) {
      form.addEventListener("input", applyFilters);
      form.addEventListener("change", applyFilters);
    }

    if (filterToggle instanceof HTMLButtonElement) {
      filterToggle.addEventListener("click", () => {
        const isOpen = root.dataset.filtersOpen !== "false";
        setFilterPanelOpen(!isOpen);
      });
    }

    applyFilters();
    setFilterPanelOpen(true);
  };

  return {
    init,
  };
};
