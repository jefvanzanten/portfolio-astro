import type { Component } from "solid-js";
import FilterMenuOption from "./FilterMenuOption";
import { useProjectState } from "../../../context/ProjectContext";
import type { Language } from "../../../types/project";

interface LanguageOptionProps {
  name: Language;
}

const LanguageOption: Component<LanguageOptionProps> = (props) => {
  const { toggleLanguage, selectedLanguages } = useProjectState();

  return (
    <FilterMenuOption
      onToggle={() => toggleLanguage(props.name)}
      isSelected={selectedLanguages().includes(props.name)}
      name={props.name}
    />
  );
};

export default LanguageOption;
