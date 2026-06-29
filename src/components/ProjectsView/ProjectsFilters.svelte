<script lang="ts">
  import { onMount } from "svelte";
  import { buildProjectsUrl } from "./helpers";

  export let categories: string[] = [];
  export let languages: string[] = [];
  export let libraries: string[] = [];
  export let totalProjects = 0;

  let selectedCategories: string[] = [];
  let selectedLanguages: string[] = [];
  let selectedLibraries: string[] = [];
  let isOpen = false;
  let resultCount = totalProjects;

  const matchesAll = (selectedValues: string[], availableValues: string[]) =>
    selectedValues.every((value) => availableValues.includes(value));

  const applyFilters = () => {
    if (typeof document === "undefined") {
      return;
    }

    const cards = Array.from(document.querySelectorAll("[data-project-card]"));
    let visibleCount = 0;

    cards.forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const category = element.dataset.category ?? "";
      const cardLanguages = (element.dataset.languages ?? "").split(",").filter(Boolean);
      const cardLibraries = (element.dataset.libraries ?? "").split(",").filter(Boolean);
      const isVisible =
        (selectedCategories.length === 0 || selectedCategories.includes(category)) &&
        matchesAll(selectedLanguages, cardLanguages) &&
        matchesAll(selectedLibraries, cardLibraries);

      element.hidden = !isVisible;
      element.style.display = isVisible ? "" : "none";
      element.setAttribute("aria-hidden", isVisible ? "false" : "true");

      if (isVisible) {
        visibleCount += 1;
      }
    });

    resultCount = visibleCount;

    const emptyState = document.querySelector("[data-projects-empty]");
    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = visibleCount > 0;
    }
  };

  const updateUrl = () => {
    window.history.replaceState(
      {},
      "",
      buildProjectsUrl(window.location.pathname, window.location.hash, {
        categories: selectedCategories,
        languages: selectedLanguages,
        libraries: selectedLibraries,
      }),
    );
  };

  const syncFilters = () => {
    applyFilters();
    updateUrl();
  };

  const resetFilters = () => {
    selectedCategories = [];
    selectedLanguages = [];
    selectedLibraries = [];
    applyFilters();
    updateUrl();
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    selectedCategories = params.getAll("category");
    selectedLanguages = params.getAll("language");
    selectedLibraries = params.getAll("library");
    isOpen =
      selectedCategories.length > 0 ||
      selectedLanguages.length > 0 ||
      selectedLibraries.length > 0;

    applyFilters();
  });
</script>

<section class="filters">
  <div class="title-row">
    <button
      type="button"
      class="filter-toggle"
      aria-expanded={isOpen}
      aria-controls="project-filter-panel"
      on:click={() => {
        isOpen = !isOpen;
      }}
    >
      {isOpen ? "Verberg filters" : "Toon filters"}
    </button>
  </div>

  <form
    id="project-filter-panel"
    class="filter-form"
    data-filter-panel
    data-open={isOpen ? "true" : "false"}
  >
    <fieldset class="filter-group">
      <legend>Categorie</legend>
      <div class="filter-options filter-options-compact">
        {#each categories as category}
          <label class="filter-option">
            <input
              type="checkbox"
              name="category"
              value={category}
              bind:group={selectedCategories}
              on:change={syncFilters}
            />
            <span>{category}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset class="filter-group">
      <legend>Programmeertalen</legend>
      <div class="filter-options filter-options-compact">
        {#each languages as language}
          <label class="filter-option">
            <input
              type="checkbox"
              name="language"
              value={language}
              bind:group={selectedLanguages}
              on:change={syncFilters}
            />
            <span>{language}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset class="filter-group">
      <legend>Frameworks & libraries</legend>
      <div class="filter-options filter-options-libraries">
        {#each libraries as library}
          <label class="filter-option">
            <input
              type="checkbox"
              name="library"
              value={library}
              bind:group={selectedLibraries}
              on:change={syncFilters}
            />
            <span>{library}</span>
          </label>
        {/each}
      </div>
    </fieldset>
  </form>

  <div class="filter-actions">
    <p class="results-count">{resultCount} van {totalProjects} projecten</p>
    <button type="button" class="reset-button" on:click={resetFilters}>
      Reset filters
    </button>
  </div>
</section>

<style>
  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0 0.5rem;
  }

  .title-row {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }

  .filter-toggle,
  .reset-button {
    border: 1px solid var(--button-secondary-border);
    border-radius: 999px;
    background: linear-gradient(
      180deg,
      var(--button-secondary-bg-start),
      var(--button-secondary-bg-end)
    );
    color: rgba(255, 255, 255, 0.92);
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
    transition:
      border-color 0.15s ease,
      transform 0.15s ease,
      background 0.15s ease;
  }

  .filter-toggle:hover,
  .reset-button:hover {
    border-color: var(--border-bright);
    transform: translateY(-1px);
    background: linear-gradient(
      180deg,
      var(--button-secondary-hover-start),
      var(--button-secondary-hover-end)
    );
  }

  .filter-form {
    display: grid;
    grid-template-columns: minmax(210px, 0.85fr) minmax(230px, 1fr) minmax(440px, 1.8fr);
    gap: 1rem;
    align-items: stretch;
  }

  .filter-form[data-open="false"] {
    display: none;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem 1.1rem 1.1rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: color-mix(in oklch, var(--card-bg), #000 18%);
    height: 100%;
  }

  .filter-group legend {
    padding: 0 0.4rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--text-bright);
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .filter-options-compact {
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
  }

  .filter-options-compact .filter-option {
    width: min(100%, 14rem);
  }

  .filter-options-libraries {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
  }

  .filter-options-libraries .filter-option {
    padding: 0.45rem 0.65rem;
    font-size: 0.82rem;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.55rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
    cursor: pointer;
    user-select: none;
    font-size: 0.9rem;
    width: 100%;
  }

  .filter-option input {
    appearance: auto;
    display: inline-block;
    accent-color: var(--accent-bright);
    flex: 0 0 auto;
    width: 1rem;
    height: 1rem;
    min-width: 1rem;
    min-height: 1rem;
    margin: 0;
    opacity: 1;
    visibility: visible;
  }

  .filter-option span {
    min-width: 0;
  }

  .filter-actions {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .results-count {
    color: var(--text-muted);
  }

  :global(html[data-theme="light"]) .filter-group {
    background: rgba(231, 230, 230, 0.4);
    border: 2px solid #000000;
  }

  :global(html[data-theme="light"]) .filter-group legend {
    color: #000000;
  }

  :global(html[data-theme="light"]) .filter-option {
    background: #464646;
    border: 2px solid #000000;
    color: #ffffff;
  }

  @media screen and (max-width: 940px) {
    .filter-toggle {
      width: 100%;
    }

    .filter-form {
      grid-template-columns: 1fr;
    }

    .filter-options-libraries {
      grid-template-columns: 1fr;
    }

    .filter-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media screen and (min-width: 1920px) {
    .filter-form {
      grid-template-columns: minmax(220px, 0.8fr) minmax(240px, 0.95fr) minmax(540px, 2fr);
    }

    .filter-options-libraries {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
