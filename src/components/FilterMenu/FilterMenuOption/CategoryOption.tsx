import type { Component } from "solid-js";
import FilterMenuOption from "./FilterMenuOption";
import { useProjectState } from "../../../context/ProjectContext";
import type { Category } from "../../../types/project";

interface CategoryOptionProps {
  name: Category;
}

const CategoryOption: Component<CategoryOptionProps> = (props) => {
  const { toggleCategory, selectedCategory } = useProjectState();

  return (
    <FilterMenuOption
      onToggle={() => toggleCategory(props.name)}
      isSelected={selectedCategory() === props.name}
      name={props.name}
    />
  );
};

export default CategoryOption;
