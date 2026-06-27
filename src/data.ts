import type { ImageMetadata } from "astro";
import type { Project, ProjectFrontmatter } from "./types/project";

type ProjectMarkdownModule = {
  frontmatter: ProjectFrontmatter;
  rawContent: () => string;
  compiledContent: () => Promise<string>;
};

const projectModules = import.meta.glob("./data/projects/*.md", {
  eager: true,
}) as Record<string, ProjectMarkdownModule>;

const projectThumbModules = import.meta.glob<{ default: ImageMetadata }>(
  "./assets/thumbs/*.{png,jpg,jpeg,webp,avif}",
);

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

export const projects: Project[] = (
  await Promise.all(
    Object.values(projectModules).map(async (projectModule) => ({
      ...projectModule.frontmatter,
      description: projectModule.rawContent().trim(),
      descriptionHtml: await projectModule.compiledContent(),
      thumbImage: await resolveThumbImage(projectModule.frontmatter.thumbUrl),
    })),
  )
).sort(
  (projectA, projectB) =>
    Date.parse(projectB.lastUpdated) - Date.parse(projectA.lastUpdated),
);
