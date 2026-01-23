export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  fork: boolean;
  pushed_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface CommitDisplay {
  sha: string;
  shortSha: string;
  message: string;
  title: string;
  author: string;
  date: string;
  url: string;
  avatarUrl: string | null;
  repo: string;
  filesChanged: number;
}
