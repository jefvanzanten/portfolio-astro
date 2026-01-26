import type { Component } from "solid-js";
import FilterMenuOption from "./FilterMenuOption";
import type { Language, Library } from "../../../data";

interface LibraryOptionProps {
  toggleLibrary: (library: Library) => void;
  name: Library;
}

const LibraryOption: Component<LibraryOptionProps> = (props) => {
  return (
    <FilterMenuOption
      onToggle={() => props.toggleLibrary(props.name)} // Needs to derive from context / hook
      isSelected={false} // Needs to derive from context / hook
      name={props.name}
    />
  );
};

export default LibraryOption;
