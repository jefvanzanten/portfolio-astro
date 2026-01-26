import type { Component } from "solid-js";
import FilterMenuOption from "./FilterMenuOption";
import { useProjectState } from "../../../context/ProjectContext";
import type { Library } from "../../../types/project";

interface LibraryOptionProps {
  name: Library;
}

const LibraryOption: Component<LibraryOptionProps> = (props) => {
  const { toggleLibrary, selectedLibraries } = useProjectState();

  return (
    <FilterMenuOption
      onToggle={() => toggleLibrary(props.name)}
      isSelected={selectedLibraries().includes(props.name)}
      name={props.name}
    />
  );
};

export default LibraryOption;
