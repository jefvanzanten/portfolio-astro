import { createSignal, type Accessor, type Setter } from "solid-js";

type FilterMenuStore = {
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
};

const [isOpen, setIsOpen] = createSignal(false);

export const useFilterMenu = (): FilterMenuStore => ({
  isOpen,
  setIsOpen,
});
