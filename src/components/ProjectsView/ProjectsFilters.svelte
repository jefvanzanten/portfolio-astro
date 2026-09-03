<script lang="ts">
  import { onMount } from "svelte";
  import type { Category } from "../../types/project";
  import {
    buildProjectsUrl,
    filterProjects,
    getAvailableCategories,
    getAvailableLanguages,
    getAvailableLibraries,
  } from "./helpers";
  import SelectFilter from "./SelectFilter.svelte";
  import type { ProjectFilterItem, ProjectFilterState } from "./types";

  export let projects: ProjectFilterItem[] = [];

  let selectedCategory: Category | "" = "";
  let selectedLanguage = "";
  let selectedLibraries: string[] = [];
  let librarySearch = "";
  let isFilterPanelOpen = false;
  let isLibraryMenuOpen = false;
  let libraryDropdown: HTMLDetailsElement;

  $: availableCategories = getAvailableCategories(projects);
  $: availableLanguages = getAvailableLanguages(projects, selectedCategory || null);
  $: availableLibraries = getAvailableLibraries(
    projects,
    selectedCategory || null,
    selectedLanguage || null,
  );
  $: visibleLibraries = availableLibraries.filter((library) =>
    library.toLocaleLowerCase().includes(librarySearch.trim().toLocaleLowerCase()),
  );
  $: hasActiveFilters =
    Boolean(selectedCategory) || Boolean(selectedLanguage) || selectedLibraries.length > 0;

  /**
   * Creates the current filter state from the component selections.
   *
   * @returns Current normalized project filters.
   */
  function getFilters(): ProjectFilterState {
    return {
      category: selectedCategory || null,
      language: selectedLanguage || null,
      libraries: selectedLibraries,
    };
  }

  /**
   * Shows only project cards that satisfy the current filter state.
   *
   * @returns Nothing.
   */
  function applyFilters(): void {
    if (typeof document === "undefined") {
      return;
    }

    const visibleFilterIds = new Set(
      filterProjects(projects, getFilters()).map((project) => project.filterId),
    );
    const cards = Array.from(document.querySelectorAll("[data-project-card]"));
    let visibleCount = 0;

    cards.forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const isVisible = visibleFilterIds.has(element.dataset.projectFilterId ?? "");
      element.hidden = !isVisible;
      element.style.display = isVisible ? "" : "none";
      element.setAttribute("aria-hidden", isVisible ? "false" : "true");

      if (isVisible) {
        visibleCount += 1;
      }
    });

    const emptyState = document.querySelector("[data-projects-empty]");
    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  /**
   * Replaces the current URL with one containing the active filters.
   *
   * @returns Nothing.
   */
  function updateUrl(): void {
    window.history.replaceState(
      {},
      "",
      buildProjectsUrl(window.location.pathname, window.location.hash, getFilters()),
    );
  }

  /**
   * Applies filters and synchronizes them to the URL.
   *
   * @returns Nothing.
   */
  function syncFilters(): void {
    applyFilters();
    updateUrl();
  }

  /**
   * Removes downstream selections that are unavailable for the active category.
   *
   * @returns Nothing.
   */
  function reconcileCategoryDependants(): void {
    const languages = getAvailableLanguages(projects, selectedCategory || null);

    if (selectedLanguage && !languages.includes(selectedLanguage)) {
      selectedLanguage = "";
    }

    reconcileLibrarySelections();
  }

  /**
   * Removes selected libraries that are unavailable for the upstream filters.
   *
   * @returns Nothing.
   */
  function reconcileLibrarySelections(): void {
    const libraries = getAvailableLibraries(
      projects,
      selectedCategory || null,
      selectedLanguage || null,
    );
    selectedLibraries = selectedLibraries.filter((library) => libraries.includes(library));
  }

  /**
   * Toggles the filter panel on mobile and closes any nested menus when hiding it.
   *
   * @returns Nothing.
   */
  function toggleFilterPanel(): void {
    isFilterPanelOpen = !isFilterPanelOpen;

    if (isFilterPanelOpen) {
      return;
    }

    isLibraryMenuOpen = false;
    document.querySelectorAll(".select-menu:popover-open").forEach((menu) => {
      if (menu instanceof HTMLElement) {
        menu.hidePopover();
      }
    });
  }

  /**
   * Selects a category and updates dependent filters.
   *
   * @param category - Category to select, or an empty value for every category.
   * @returns Nothing.
   */
  function selectCategory(category: Category | ""): void {
    selectedCategory = availableCategories.includes(category as Category) ? category : "";
    reconcileCategoryDependants();
    librarySearch = "";
    syncFilters();
  }

  /**
   * Selects a language and updates dependent library filters.
   *
   * @param language - Language to select, or an empty value for every language.
   * @returns Nothing.
   */
  function selectLanguage(language: string): void {
    selectedLanguage = availableLanguages.includes(language) ? language : "";
    reconcileLibrarySelections();
    librarySearch = "";
    syncFilters();
  }

  /**
   * Handles changes to a library checkbox without depending on rendered search results.
   *
   * @param event - Library checkbox change event.
   * @returns Nothing.
   */
  function handleLibraryChange(event: Event): void {
    const checkbox = event.currentTarget;
    if (!(checkbox instanceof HTMLInputElement)) {
      return;
    }

    selectedLibraries = checkbox.checked
      ? [...new Set([...selectedLibraries, checkbox.value])]
      : selectedLibraries.filter((library) => library !== checkbox.value);
    syncFilters();
  }

  /**
   * Removes the active category and reconciles dependent filters.
   *
   * @returns Nothing.
   */
  function removeCategory(): void {
    selectedCategory = "";
    reconcileCategoryDependants();
    syncFilters();
  }

  /**
   * Removes the active language and reconciles dependent filters.
   *
   * @returns Nothing.
   */
  function removeLanguage(): void {
    selectedLanguage = "";
    reconcileLibrarySelections();
    syncFilters();
  }

  /**
   * Removes one selected library.
   *
   * @param library - Library to remove.
   * @returns Nothing.
   */
  function removeLibrary(library: string): void {
    selectedLibraries = selectedLibraries.filter((value) => value !== library);
    syncFilters();
  }

  /**
   * Closes the library menu when a pointer interaction occurs outside it.
   *
   * @param event - Document pointer event.
   * @returns Nothing.
   */
  function handleDocumentPointerDown(event: PointerEvent): void {
    if (event.target instanceof Node && !libraryDropdown?.contains(event.target)) {
      isLibraryMenuOpen = false;
    }
  }

  /**
   * Closes the library menu when Escape is pressed within the dropdown.
   *
   * @param event - Document keyboard event.
   * @returns Nothing.
   */
  function handleDocumentKeydown(event: KeyboardEvent): void {
    if (
      event.key === "Escape" &&
      event.target instanceof Node &&
      libraryDropdown?.contains(event.target)
    ) {
      isLibraryMenuOpen = false;
    }
  }

  /**
   * Prevents the filter form from submitting.
   *
   * @returns Nothing.
   */
  function handleSubmit(): void {
    return;
  }

  /**
   * Initializes filters from the URL.
   *
   * @returns Nothing.
   */
  function initializeFilters(): void {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    selectedCategory =
      availableCategories.find((category) => category === categoryParam) ?? "";

    const languages = getAvailableLanguages(projects, selectedCategory || null);
    const languageParam = params.get("language");
    selectedLanguage = languages.find((language) => language === languageParam) ?? "";

    const libraries = getAvailableLibraries(
      projects,
      selectedCategory || null,
      selectedLanguage || null,
    );
    selectedLibraries = [
      ...new Set(params.getAll("library").filter((library) => libraries.includes(library))),
    ];
    applyFilters();
    updateUrl();
  }

  onMount(initializeFilters);
</script>

<svelte:document
  onpointerdown={handleDocumentPointerDown}
  onkeydown={handleDocumentKeydown}
/>

<section class="filters">
  {#if isFilterPanelOpen}
    <button
      type="button"
      class="filter-backdrop"
      aria-label="Sluit filters"
      on:click={toggleFilterPanel}
    ></button>
  {/if}

  <button
    type="button"
    class="mobile-filter-toggle"
    aria-expanded={isFilterPanelOpen}
    aria-controls="project-filter-panel"
    aria-label={isFilterPanelOpen ? "Verberg filters" : "Toon filters"}
    on:click={toggleFilterPanel}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  </button>

  <form
    id="project-filter-panel"
    class="filter-form"
    data-filter-panel
    data-open={isFilterPanelOpen ? "true" : "false"}
    on:submit|preventDefault={handleSubmit}
  >
    <SelectFilter
      id="project-category"
      label="Categorie"
      allLabel="Alle categorieën"
      options={availableCategories}
      selectedValue={selectedCategory}
      onSelect={selectCategory}
      anchorName="--category-filter"
    />

    <SelectFilter
      id="project-language"
      label="Programmeertaal"
      allLabel="Alle programmeertalen"
      options={availableLanguages}
      selectedValue={selectedLanguage}
      onSelect={selectLanguage}
      anchorName="--language-filter"
    />

    <div class="filter-group">
      <span class="filter-label">Frameworks & libraries</span>
      <details
        class="library-dropdown"
        bind:this={libraryDropdown}
        bind:open={isLibraryMenuOpen}
      >
        <summary>
          {selectedLibraries.length === 0
            ? "Kies frameworks / libraries"
            : `Frameworks / libraries (${selectedLibraries.length})`}
        </summary>
        <div class="library-popover">
          <label class="search-label" for="library-search">Zoek framework of library</label>
          <input
            id="library-search"
            class="library-search"
            type="search"
            placeholder="Zoeken…"
            bind:value={librarySearch}
          />

          <div class="library-options">
            {#each visibleLibraries as library (library)}
              <label class="library-option">
                <input
                  type="checkbox"
                  name="library"
                  value={library}
                  checked={selectedLibraries.includes(library)}
                  on:change={handleLibraryChange}
                />
                <span>{library}</span>
              </label>
            {:else}
              <p class="no-options">Geen frameworks of libraries gevonden.</p>
            {/each}
          </div>
        </div>
      </details>
    </div>
  </form>

  <div class="filter-actions">
    {#if hasActiveFilters}
      <div class="active-filters" aria-label="Actieve filters">
        {#if selectedCategory}
          <button type="button" class="filter-chip" on:click={removeCategory}>
            <span>Categorie: {selectedCategory}</span><span aria-hidden="true">×</span>
          </button>
        {/if}

        {#if selectedLanguage}
          <button type="button" class="filter-chip" on:click={removeLanguage}>
            <span>Taal: {selectedLanguage}</span><span aria-hidden="true">×</span>
          </button>
        {/if}

        {#each selectedLibraries as library (library)}
          <button type="button" class="filter-chip" on:click={() => removeLibrary(library)}>
            <span>{library}</span><span aria-hidden="true">×</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: var(--projects-filter-height);
    padding: var(--projects-filter-height) 0 0;

    @media screen and (max-width: 767px) {
      min-height: 0;
      padding: 1rem 0 0.5rem;
    }

    .mobile-filter-toggle {
      display: none;
      anchor-name: --mobile-filter-toggle;
      align-items: center;
      justify-content: center;
      flex: 0 0 2.5rem;
      border: none;
      border-radius: 50%;
      background: #0d9186;
      color: var(--text-bright);
      cursor: pointer;
      padding: 0;

      @media screen and (max-width: 767px) {
        position: fixed;
        z-index: 30;
        top: calc(var(--nav-height) + 1rem);
        right: 5%;
        display: inline-flex;
        box-shadow: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.35);
        width: 44px;
        height: 44px;

        svg {
            width: 2rem;
            height: 2rem;
            stroke-width: 2;
        }
      }

      &:active,
      &[aria-expanded="true"] {
        border-color: var(--border);
      }

      &:focus-visible {
        outline: 2px solid var(--border);
        outline-offset: 2px;
      }
    }

    .filter-backdrop {
      display: none;

      @media screen and (max-width: 767px) {
        position: fixed;
        z-index: 24;
        inset: var(--nav-height) 0 0;
        display: block;
        border: 0;
        background: rgba(0, 0, 0, 0.58);
        backdrop-filter: blur(3px);
        cursor: pointer;
      }
    }

    .filter-form {
      position: fixed;
      z-index: 20;
      top: var(--nav-height);
      left: 50%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      align-items: start;
      width: min(calc(100% - 3rem), var(--page-content-width));
      padding: 2rem 0 1rem;
      background: var(--bg);
      transform: translateX(-50%);

      @media screen and (max-width: 940px) and (min-width: 768px) {
        width: 90%;
      }

      @media screen and (max-width: 767px) {
        z-index: 25;
        position-anchor: --mobile-filter-toggle;
        top: calc(anchor(bottom) + 0.75rem);
        right: 5%;
        left: 5%;
        grid-template-columns: 1fr;
        width: auto;
        max-height: calc(100svh - var(--nav-height) - 5.25rem);
        overflow-y: auto;
        transform: none;
        padding: 1rem;
        border: 1px solid var(--border-bright);
        border-radius: 0.75rem;
        background: var(--card-bg);
        box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.35);

        &[data-open="false"] {
          display: none;
        }
      }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      min-width: 0;

      .filter-label {
        color: var(--text-bright);
        font-family: var(--font-display);
        font-size: 0.9rem;
      }

      summary {
        box-sizing: border-box;
        width: 100%;
        min-height: 2.85rem;
        border: 1px solid var(--border);
        border-radius: 0.65rem;
        background: color-mix(in oklch, var(--card-bg), #000 18%);
        color: var(--text-bright);
        cursor: pointer;
        font: inherit;
        padding: 0.72rem 0.85rem;
      }
    }



    .library-dropdown {
      position: relative;
      anchor-name: library-anchor;

      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        list-style: none;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary::after {
        content: "▾";
        flex: 0 0 auto;
      }

      &[open] summary::after {
        transform: rotate(180deg);
      }
    }

    svg {
      width: 1rem;
      height: 1rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-width: 1.8;
    }

    .search-label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .library-search {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: color-mix(in oklch, var(--card-bg), #000 22%);
      color: var(--text-bright);
      font: inherit;
      padding: 0.7rem 0.75rem;
    }

    .library-options {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      overflow-y: auto;

      .library-option {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.55rem 0.6rem;
        border-radius: 0.45rem;
        cursor: pointer;
      }

      .library-option:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .library-option input {
        width: 1rem;
        height: 1rem;
        margin: 0;
        accent-color: var(--accent-bright);
      }
    }

    .no-options {
      margin: 0;
      padding: 0.5rem;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .filter-actions,
    .active-filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.55rem;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-bright);
      cursor: pointer;
      font: inherit;
      font-size: 0.82rem;
      padding: 0.48rem 0.7rem;

      &:focus-visible {
        outline: 2px solid var(--border);
        outline-offset: 2px;
      }
    }

  }

  :global(html[data-theme="light"]) .filters {
    .filter-group {
      summary,
      .library-search {
        border: 2px solid #000;
        background: rgba(231, 230, 230, 0.95);
        color: #000;
      }
    }

    .library-popover {
      border: 2px solid #000;
      background: #e7e6e6;
    }

    .mobile-filter-toggle,
    .filter-chip {
      border: 2px solid #000;
      background: #464646;
      color: #fff;
    }
  }
</style>
