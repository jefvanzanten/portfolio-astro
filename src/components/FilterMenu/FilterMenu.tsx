import { createSignal, Show, type Component } from "solid-js";
import styles from "./FilterMenu.module.css";
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
          <legend class={styles.legend}>Programmeer- & script-talen</legend>
          <div class={styles.libraryGroup}>
            <LanguageOption name="C#" />
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
            <LibraryOption name="Drizzle" />
            <LibraryOption name="Express" />
            <LibraryOption name="JavaFX" />
          </div>
          <div class={styles.libraryGroup}>
            <LibraryOption name="Jetpack Compose" />
            <LibraryOption name="Nextjs" />
            <LibraryOption name="React" />
            <LibraryOption name="React-Native" />
            <LibraryOption name="React-Router" />
          </div>
          <div class={styles.libraryGroup}>
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
