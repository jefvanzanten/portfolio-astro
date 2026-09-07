import type { ImageMetadata } from "astro";
import type { Project, ProjectFrontmatter } from "./types/project";

type ProjectMarkdownModule = {
  frontmatter: ProjectFrontmatter;
  rawContent: () => string;
  compiledContent: () => Promise<string>;
  getHeadings: () => Project["headings"];
};

const projectModules = import.meta.glob("./data/project-cards/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule>;

const projectPageModules = import.meta.glob("./data/project-pages/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule>;

const projectThumbModules = import.meta.glob<{ default: ImageMetadata }>(
  "./assets/thumbs/*.{png,jpg,jpeg,webp,avif}",
);

/**
 * Resolves a public thumbnail URL to its optimized Astro image metadata.
 *
 * @param thumbUrl - Public URL of the project's thumbnail.
 * @returns The optimized thumbnail metadata.
 */
const resolveThumbImage = async (thumbUrl: string) => {
  const fileName = thumbUrl.split("/").pop();
  const thumbModule = fileName
    ? projectThumbModules[`./assets/thumbs/${fileName}`]
    : undefined;

  if (!thumbModule) {
    throw new Error(`Missing optimized thumb asset for "${thumbUrl}".`);
  }

  const { default: thumbImage } = await thumbModule();
  return thumbImage;
};

export const projects: Project[] = await getProjectData(projectModules);

export const projectPages: Project[] = await getProjectData(projectPageModules);

/**
 * Converts imported Markdown modules into project data.
 *
 * @param module - Markdown modules to convert.
 * @returns Projects sorted by their most recent update date.
 */
async function getProjectData(
  module: Record<string, ProjectMarkdownModule>,
): Promise<Project[]> {
  return (
    await Promise.all(
      Object.values(module).map(async (module) => ({
        ...module.frontmatter,
        description: module.rawContent().trim(),
        descriptionHtml: await module.compiledContent(),
        headings: module.getHeadings(),
        thumbImage: await resolveThumbImage(module.frontmatter.thumbUrl),
      })),
    )
  ).sort(
    (projectA, projectB) =>
      Date.parse(projectB.lastUpdated) - Date.parse(projectA.lastUpdated),
  );
}
