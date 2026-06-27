import type { ImageMetadata } from "astro";

export type Language =
  | "TypeScript"
  | "C#"
  | "Python"
  | "CSS"
  | "HTML"
  | "Rust"
  | "Kotlin"
  | "Java";

export type Category =
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "Fullstack"
  | "Desktop";

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
  | "Weasyprint";

export type Project = {
  name: string;
  description: string;
  descriptionHtml: string;
  slug: string;
  url?: string;
  liveUrl?: string;
  downloadUrl?: string;
  languages: Language[];
  libraries: Library[];
  images: string[];
  category: Category;
  lastUpdated: string;
  highlighted: boolean;
  coverUrl: string;
  thumbUrl: string;
  thumbImage: ImageMetadata;
};

export type ProjectFrontmatter = Omit<
  Project,
  "description" | "descriptionHtml" | "thumbImage"
>;
