import type { Component } from "solid-js";
import FilterMenuOption from "./FilterMenuOption";
import type { Language, Library } from "../../../data";

interface LanguageOptionProps {
  toggleLanguage: (language: Language) => void;
  name: Language;
}

const LanguageOption: Component<LanguageOptionProps> = (props) => {
  return (
    <FilterMenuOption
      onToggle={() => props.toggleLanguage(props.name)} // Needs to derive from context / hook
      isSelected={false} // Needs to derive from context / hook
      name={props.name}
    />
  );
};

export default LanguageOption;
