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
  | "Drizzle"
  | "Better-Auth"
  | "TanStack Query"
  | "Nextjs"
  | "React-Native"
  | "Jetpack Compose"
  | "Jest"
  | "RoomDB"
  | "JavaFX";

export type Project = {
  id: number;
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
