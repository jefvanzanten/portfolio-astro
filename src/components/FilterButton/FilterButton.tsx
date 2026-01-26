import type { Component } from "solid-js";
import {
  isFilterMenuOpen,
  setIsFilterMenuOpen,
} from "../FilterMenu/FilterMenu";
import styles from "./FilterButton.module.css";

const FilterButton: Component = () => {
  const handleClick = () => setIsFilterMenuOpen(!isFilterMenuOpen());

  return (
    <button
      class={`${styles.button} ${isFilterMenuOpen() ? styles.active : ""}`}
      onClick={handleClick}
    >
      Filter
    </button>
  );
};

export default FilterButton;
