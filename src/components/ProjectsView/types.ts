export type ProjectViewModel = {
  name: string;
  slug: string;
  descriptionHtml: string;
  url?: string;
  liveUrl?: string;
  downloadUrl?: string;
  languages: string[];
  libraries: string[];
  category: string;
  coverUrl: string;
  thumbSrc: string;
  thumbWidth: number;
  thumbHeight: number;
};

export type ProjectFilterState = {
  categories: string[];
  languages: string[];
  libraries: string[];
};
