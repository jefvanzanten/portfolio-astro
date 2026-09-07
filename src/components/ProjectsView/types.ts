import type { Category } from "../../types/project";

export type ProjectFilterable = {
  category: Category;
  languages: string[];
  libraries: string[];
};

export type ProjectFilterItem = ProjectFilterable & {
  filterId: string;
};

export type ProjectFilterOption<Value extends string = string> = {
  value: Value;
  count: number;
};

export type ProjectFilterState = {
  category: Category | null;
  language: string | null;
  libraries: string[];
};
