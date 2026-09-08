import type { ImageMetadata } from "astro";
import type {
  Project,
  ProjectFrontmatter,
  ProjectPageData,
  ProjectPageFrontmatter,
} from "./types/project";

type ProjectMarkdownModule<Frontmatter> = {
  frontmatter: Frontmatter;
  compiledContent: () => Promise<string>;
  getHeadings: () => ProjectPageData["headings"];
};

const projectModules = import.meta.glob("./data/project-cards/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule<ProjectFrontmatter>>;

const projectPageModules = import.meta.glob("./data/project-pages/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule<ProjectPageFrontmatter>>;

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

export const projectPages: ProjectPageData[] = await getProjectPageData(
  projectPageModules,
);

/**
 * Converts imported project-card Markdown modules into project data.
 *
 * @param modules - Project-card Markdown modules to convert.
 * @returns Projects sorted by their most recent update date.
 */
async function getProjectData(
  modules: Record<string, ProjectMarkdownModule<ProjectFrontmatter>>,
): Promise<Project[]> {
  return (
    await Promise.all(
      Object.values(modules).map(async ({ frontmatter, compiledContent }) => {
        const { thumbUrl, ...projectFrontmatter } = frontmatter;

        return {
          ...projectFrontmatter,
          descriptionHtml: await compiledContent(),
          thumbImage: await resolveThumbImage(thumbUrl),
        };
      }),
    )
  ).sort(
    (projectA, projectB) =>
      Date.parse(projectB.lastUpdated) - Date.parse(projectA.lastUpdated),
  );
}

/**
 * Converts imported project-page Markdown modules into project-page data.
 *
 * @param modules - Project-page Markdown modules to convert.
 * @returns Project pages with their compiled content and headings.
 */
async function getProjectPageData(
  modules: Record<string, ProjectMarkdownModule<ProjectPageFrontmatter>>,
): Promise<ProjectPageData[]> {
  return Promise.all(
    Object.values(modules).map(
      async ({ frontmatter, compiledContent, getHeadings }) => ({
        ...frontmatter,
        descriptionHtml: await compiledContent(),
        headings: getHeadings(),
      }),
    ),
  );
}
