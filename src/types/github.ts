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

// Events API types
export interface GitHubPushEvent {
  id: string;
  type: "PushEvent";
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string; // "username/repo-name"
  };
  payload: {
    commits: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
      };
    }>;
  };
  created_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: unknown;
  created_at: string;
}
