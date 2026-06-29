import { writable } from "svelte/store";

type ProjectImageState = {
  activeImageUrl: string;
};

const createProjectImageStore = () => {
  const { subscribe, set } = writable<ProjectImageState>({
    activeImageUrl: "",
  });

  return {
    subscribe,
    open(imageUrl: string) {
      set({ activeImageUrl: imageUrl });
    },
    close() {
      set({ activeImageUrl: "" });
    },
  };
};

export const projectImageStore = createProjectImageStore();
