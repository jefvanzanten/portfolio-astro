import type { Component } from "solid-js";
import styles from "./FilterMenuOption.module.css";

type FilterMenuOptionProps = {
  name: string;
  isSelected: boolean;
  onToggle: () => void;
};

const FilterMenuOption: Component<FilterMenuOptionProps> = (props) => {
  return (
    <div class={styles.item}>
      <input
        onChange={props.onToggle}
        checked={props.isSelected}
        type="checkbox"
        id={props.name}
        name={props.name}
      />
      <label for={props.name}>{props.name}</label>
    </div>
  );
};

export default FilterMenuOption;
