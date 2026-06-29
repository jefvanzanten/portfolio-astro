export const projectImageState = $state({
  activeImageUrl: "",
});

export const openProjectImage = (imageUrl: string) => {
  projectImageState.activeImageUrl = imageUrl;
};

export const closeProjectImage = () => {
  projectImageState.activeImageUrl = "";
};
