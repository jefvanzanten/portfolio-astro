import type { CommitDisplay, GitHubCommit, GitHubRepo } from "../types/github";

const GITHUB_API = "https://api.github.com";
const DEFAULT_REPO_LIMIT = 8;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Site",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchUserRepos(
  username: string,
  repoLimit: number = DEFAULT_REPO_LIMIT,
): Promise<GitHubRepo[]> {
  const repos = await fetchJson<GitHubRepo[]>(
    `${GITHUB_API}/users/${username}/repos?type=owner&sort=pushed&per_page=100`,
  );

  return repos.filter((repo) => !repo.fork).slice(0, repoLimit);
}

async function fetchRepoCommits(
  owner: string,
  repo: string,
  perPage: number,
): Promise<CommitDisplay[]> {
  const commits = await fetchJson<GitHubCommit[]>(
    `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  );

  return commits.map((commit) => ({
    sha: commit.sha,
    shortSha: commit.sha.substring(0, 7),
    message: commit.commit.message,
    title: commit.commit.message.split("\n")[0].substring(0, 72),
    author: commit.author?.login ?? commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url,
    avatarUrl: commit.author?.avatar_url ?? null,
    repo,
    filesChanged: 0,
  }));
}

async function fetchCommitFilesCount(
  owner: string,
  repo: string,
  sha: string,
): Promise<number> {
  const data = await fetchJson<{ files?: { filename: string }[] }>(
    `${GITHUB_API}/repos/${owner}/${repo}/commits/${sha}`,
  );

  return data.files?.length ?? 0;
}

export async function fetchLatestCommitsPublic(
  username: string,
  totalLimit: number = 10,
): Promise<CommitDisplay[]> {
  const repoLimit = Math.max(1, Math.min(DEFAULT_REPO_LIMIT, totalLimit));
  const repos = await fetchUserRepos(username, repoLimit);

  if (repos.length === 0) {
    return [];
  }

  const commitsPerRepo = Math.max(2, Math.ceil(totalLimit / repos.length));
  const allCommits = await Promise.all(
    repos.map((repo) => fetchRepoCommits(username, repo.name, commitsPerRepo)),
  );

  const topCommits = allCommits
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, totalLimit);

  return Promise.all(
    topCommits.map(async (commit) => ({
      ...commit,
      filesChanged: await fetchCommitFilesCount(username, commit.repo, commit.sha),
    })),
  );
}
