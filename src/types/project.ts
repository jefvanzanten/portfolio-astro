import type { ImageMetadata, MarkdownHeading } from "astro";

export type Language =
  "TypeScript" | "C#" | "Python" | "CSS" | "HTML" | "Rust" | "Kotlin" | "Java";

export type Category =
  "Frontend" | "Backend" | "Mobile" | "Fullstack" | "Desktop";

export type Library =
  | "React"
  | "Electron"
  | "Astro"
  | "Solidjs"
  | "Svelte"
  | "Tauri"
  | "TailwindCSS"
  | "React-Router"
  | "Express"
  | "Drizzle ORM"
  | "Better-Auth"
  | "TanStack Query"
  | "Nextjs"
  | "React-Native"
  | "Hono"
  | "Jetpack Compose"
  | "Jest"
  | "RoomDB"
  | "Resend"
  | "Pydantic"
  | "FastAPI"
  | "JavaFX"
  | "Weasyprint"
  | "CodeMirror"
  | "Convex"
  | "SQLite"
  | "Zod";

export type Project = {
  name: string;
  descriptionHtml: string;
  slug: string;
  url?: string;
  liveUrl?: string;
  languages: Language[];
  libraries: Library[];
  category: Category;
  lastUpdated: string;
  highlighted: boolean;
  coverUrl: string;
  thumbImage: ImageMetadata;
};

export type ProjectPageData = {
  name: string;
  slug: string;
  summary: string;
  descriptionHtml: string;
  headings: MarkdownHeading[];
};

export type ProjectFrontmatter = Omit<
  Project,
  "descriptionHtml" | "thumbImage"
> & {
  thumbUrl: string;
};

export type ProjectPageFrontmatter = Omit<
  ProjectPageData,
  "descriptionHtml" | "headings"
>;
