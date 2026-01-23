import style from "./FilterTagBar.module.css";

type FilterTagBarProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
};

export default function FilterTagBar({ tags, onTagClick }: FilterTagBarProps) {
  return (
    <div className={style.container}>
      {tags.map((tag) => (
        <button key={tag} onClick={() => onTagClick(tag)} className={style.tag}>
          {tag}
        </button>
      ))}
    </div>
  );
}
