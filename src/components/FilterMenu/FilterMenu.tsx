import { createSignal, Show, type Component } from "solid-js";
import type { Language, Library } from "../../data";
import styles from "./FilterMenu.module.css";
import LanguageOption from "./FilterMenuOption/LanguageOption";
import LibraryOption from "./FilterMenuOption/LibraryOption";

type FilterMenuProps = {
  selectedLanguages: Language[];
  selectedLibraries: Library[];
  toggleLanguage: (language: Language) => void;
  toggleLibrary: (library: Library) => void;
};

export const [isFilterMenuOpen, setIsFilterMenuOpen] = createSignal(false);

const FilterMenu: Component<FilterMenuProps> = (props) => {
  return (
    <Show when={isFilterMenuOpen()}>
      <div
        class={styles.backdrop}
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen())}
      />
      <div class={styles.container}>
        <fieldset class={styles.fieldset}>
          <legend class={styles.legend}>Programmeer- & script-talen</legend>
          <div class={styles.libraryGroup}>
            <LanguageOption
              toggleLanguage={props.toggleLanguage}
              name="TypeScript"
            />
            <LanguageOption
              toggleLanguage={props.toggleLanguage}
              name="Kotlin"
            />
            <LanguageOption toggleLanguage={props.toggleLanguage} name="Java" />
            <LanguageOption toggleLanguage={props.toggleLanguage} name="CSS" />
          </div>
        </fieldset>

        <fieldset class={styles.libraries}>
          <legend class={styles.legend}>Frameworks & libraries</legend>
          <div class={styles.libraryGroup}>
            <LibraryOption toggleLibrary={props.toggleLibrary} name="React" />
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="TailwindCSS"
            />
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="React-Router"
            />
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="TanStackQuery"
            />
          </div>
          <div class={styles.libraryGroup}>
            <LibraryOption toggleLibrary={props.toggleLibrary} name="Nextjs" />
            <LibraryOption toggleLibrary={props.toggleLibrary} name="Express" />
            <LibraryOption toggleLibrary={props.toggleLibrary} name="Drizzle" />
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="Better-Auth"
            />
          </div>
          <div class={styles.libraryGroup}>
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="React-Native"
            />
            <LibraryOption
              toggleLibrary={props.toggleLibrary}
              name="JetpackCompose"
            />
            <LibraryOption toggleLibrary={props.toggleLibrary} name="JavaFX" />
          </div>
        </fieldset>
      </div>
    </Show>
  );
};

export default FilterMenu;
