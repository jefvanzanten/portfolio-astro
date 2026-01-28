import { createSignal, Show, type Component } from "solid-js";
import styles from "./FilterMenu.module.css";
import CategoryOption from "./FilterMenuOption/CategoryOption";
import LanguageOption from "./FilterMenuOption/LanguageOption";
import LibraryOption from "./FilterMenuOption/LibraryOption";

export const [isFilterMenuOpen, setIsFilterMenuOpen] = createSignal(false);

const FilterMenu: Component = () => {
  return (
    <Show when={isFilterMenuOpen()}>
      <div
        class={styles.backdrop}
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen())}
      />
      <div class={styles.container}>
        <fieldset class={styles.libraries}>
          <legend class={styles.legend}>Categorieën</legend>
          <div class={styles.libraryGroup}>
            <CategoryOption name="Frontend" />
            <CategoryOption name="Backend" />
            <CategoryOption name="Fullstack" />
          </div>
          <div class={styles.libraryGroup}>
            <CategoryOption name="Mobile" />
            <CategoryOption name="Desktop" />
          </div>
        </fieldset>

        <fieldset class={styles.libraries}>
          <legend class={styles.legend}>Programmeer- & script-talen</legend>
          <div class={styles.libraryGroup}>
            <LanguageOption name="CSS" />
            <LanguageOption name="HTML" />
            <LanguageOption name="Java" />
          </div>
          <div class={styles.libraryGroup}>
            <LanguageOption name="Kotlin" />
            <LanguageOption name="Python" />
            <LanguageOption name="TypeScript" />
          </div>
        </fieldset>

        <fieldset class={styles.libraries}>
          <legend class={styles.legend}>Frameworks & libraries</legend>
          <div class={styles.libraryGroup}>
            <LibraryOption name="Astro" />
            <LibraryOption name="Better-Auth" />
            <LibraryOption name="Drizzle ORM" />
            <LibraryOption name="Express" />
            <LibraryOption name="FastAPI" />
          </div>
          <div class={styles.libraryGroup}>
            <LibraryOption name="JavaFX" />
            <LibraryOption name="Jetpack Compose" />
            <LibraryOption name="Nextjs" />
            <LibraryOption name="React" />
            <LibraryOption name="React-Native" />
          </div>
          <div class={styles.libraryGroup}>
            <LibraryOption name="React-Router" />
            <LibraryOption name="Solidjs" />
            <LibraryOption name="TailwindCSS" />
            <LibraryOption name="TanStack Query" />
          </div>
        </fieldset>
      </div>
    </Show>
  );
};

export default FilterMenu;
