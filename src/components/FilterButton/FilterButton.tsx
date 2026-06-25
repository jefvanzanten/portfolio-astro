import type { Component } from "solid-js";
import styles from "./FilterButton.module.css";
import { useFilterMenu } from "../../hooks/useFilterMenu";

const FilterButton: Component = () => {
  const { isOpen, setIsOpen } = useFilterMenu();

  const handleClick = () => setIsOpen(!isOpen());

  return (
    <button
      class={`${styles.button} ${isOpen() ? styles.active : ""}`}
      onClick={handleClick}
    >
      Filter
    </button>
  );
};

export default FilterButton;
