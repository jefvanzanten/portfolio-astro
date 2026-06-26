import { createProjectFilterController } from "./projectFilters";
import { createProjectImageModalController } from "./projectImageModal";

const PROJECTS_ROOT_SELECTOR = "[data-projects-root]";

export const setupProjectsPage = () => {
  const root = document.querySelector(PROJECTS_ROOT_SELECTOR);

  if (!(root instanceof HTMLElement) || root.dataset.projectsInitialized === "true") {
    return;
  }

  root.dataset.projectsInitialized = "true";

  createProjectFilterController(root).init();
  createProjectImageModalController(root).init();
};
