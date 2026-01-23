import styles from "./FilterButton.module.css";

type FilterButtonProps = {
  handleClick: () => void;
  isActive: boolean;
};

export default function FilterButton({
  handleClick,
  isActive,
}: FilterButtonProps) {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
    >
      Filter
    </button>
  );
}
