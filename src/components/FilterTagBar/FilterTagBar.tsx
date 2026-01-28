import { Show, For, type Component } from "solid-js";
import { useProjectState } from "../../context/ProjectContext";
import style from "./FilterTagBar.module.css";
import type { Category, Language, Library } from "../../types/project";

const FilterTagBar: Component = () => {
  const {
    activeTags,
    selectedCategory,
    selectedLanguages,
    toggleCategory,
    toggleLanguage,
    toggleLibrary,
  } = useProjectState();

  const onTagClick = (tag: string) => {
    if (selectedCategory() === tag) {
      toggleCategory(tag as Category);
    } else if (selectedLanguages().includes(tag as Language)) {
      toggleLanguage(tag as Language);
    } else {
      toggleLibrary(tag as Library);
    }
  };

  return (
    <Show when={activeTags().length > 0}>
      <div class={style.container}>
        <For each={activeTags()}>
          {(tag) => (
            <button onClick={() => onTagClick(tag)} class={style.tag}>
              {tag}
            </button>
          )}
        </For>
      </div>
    </Show>
  );
};

export default FilterTagBar;
