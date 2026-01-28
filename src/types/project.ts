export type Language =
  | "TypeScript"
  | "C#"
  | "Python"
  | "CSS"
  | "HTML"
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
  | "Astro"
  | "Solidjs"
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
  description: string | string[];
  slug: string;
  url: string;
  languages: Language[];
  libraries: Library[];
  images: string[];
  category: Category;
  lastUpdated: string;
  highlighted: boolean;
  coverUrl: string;
  thumbUrl: string;
};
