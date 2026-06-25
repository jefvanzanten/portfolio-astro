import type { Project, ProjectFrontmatter } from "./types/project";

type ProjectMarkdownModule = {
  frontmatter: ProjectFrontmatter;
  rawContent: () => string;
  compiledContent: () => Promise<string>;
};

const projectModules = import.meta.glob("./data/projects/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule>;

export const projects: Project[] = (
  await Promise.all(
    Object.values(projectModules).map(async (projectModule) => ({
      ...projectModule.frontmatter,
      description: projectModule.rawContent().trim(),
      descriptionHtml: await projectModule.compiledContent(),
    })),
  )
).sort(
  (projectA, projectB) =>
    Date.parse(projectB.lastUpdated) - Date.parse(projectA.lastUpdated),
);
