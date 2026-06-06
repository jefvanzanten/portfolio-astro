import * as fs from "node:fs";
import * as path from "node:path";
import type { GitHubRepo, GitHubCommit, CommitDisplay } from "../types/github";

const GITHUB_API = "https://api.github.com";

// Cache configuration
const CACHE_DIR = ".cache";
const CACHE_FILE = path.join(CACHE_DIR, "github-commits.json");
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SNAPSHOT_FILE = path.join("src", "data", "github-commits-snapshot.json");
const SHOULD_UPDATE_SNAPSHOT = process.env.UPDATE_GITHUB_SNAPSHOT === "true";

interface CacheData {
  timestamp: number;
  commits: CommitDisplay[];
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

function readCache(maxAgeMs: number = CACHE_TTL_MS): CommitDisplay[] | null {
  const cache = readJsonFile<CacheData>(CACHE_FILE);

  if (!cache) {
    return null;
  }

  if (Date.now() - cache.timestamp < maxAgeMs) {
    console.log("Using cached GitHub commits");
    return cache.commits;
  }

  console.log("Cache expired, fetching fresh data");
  return null;
}

function writeCache(commits: CommitDisplay[]): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), commits }, null, 2)
    );
    console.log("Cached GitHub commits");
  } catch (error) {
    console.error("Failed to write cache:", error);
  }
}

function readSnapshot(): CommitDisplay[] | null {
  return readJsonFile<CommitDisplay[]>(SNAPSHOT_FILE);
}

function writeSnapshot(commits: CommitDisplay[]): void {
  if (!SHOULD_UPDATE_SNAPSHOT || commits.length === 0) {
    return;
  }

  const nextSnapshot = `${JSON.stringify(commits, null, 2)}\n`;

  try {
    const currentSnapshot = fs.existsSync(SNAPSHOT_FILE)
      ? fs.readFileSync(SNAPSHOT_FILE, "utf-8")
      : null;

    if (currentSnapshot === nextSnapshot) {
      return;
    }

    fs.mkdirSync(path.dirname(SNAPSHOT_FILE), { recursive: true });
    fs.writeFileSync(SNAPSHOT_FILE, nextSnapshot);
    console.log("Updated GitHub commits snapshot");
  } catch (error) {
    console.error("Failed to write snapshot:", error);
  }
}

function persistCommits(commits: CommitDisplay[]): void {
  if (commits.length === 0) {
    return;
  }

  writeCache(commits);
  writeSnapshot(commits);
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-Site",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchUserRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const headers = getHeaders(token);
  const url = `${GITHUB_API}/users/${username}/repos?type=owner&sort=pushed&per_page=100`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} fetching repos`);
    return [];
  }

  const repos: GitHubRepo[] = await response.json();

  // Filter out forks
  return repos.filter((repo) => !repo.fork);
}

async function fetchCommitFilesCount(
  owner: string,
  repo: string,
  sha: string,
  token?: string
): Promise<number> {
  const headers = getHeaders(token);
  const url = `${GITHUB_API}/repos/${owner}/${repo}/commits/${sha}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();
  return data.files?.length ?? 0;
}

export async function fetchRepoCommits(
  owner: string,
  repo: string,
  perPage: number = 5,
  token?: string
): Promise<CommitDisplay[]> {
  const headers = getHeaders(token);
  const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} for ${repo}`);
    return [];
  }

  const commits: GitHubCommit[] = await response.json();

  return commits.map((commit) => ({
    sha: commit.sha,
    shortSha: commit.sha.substring(0, 7),
    message: commit.commit.message,
    title: commit.commit.message.split("\n")[0].substring(0, 72),
    author: commit.author?.login ?? commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url,
    avatarUrl: commit.author?.avatar_url ?? null,
    repo: repo,
    filesChanged: 0, // Will be populated later for top commits
  }));
}

export async function fetchLatestCommits(
  username: string,
  totalLimit: number = 10,
  token?: string
): Promise<CommitDisplay[]> {
  const cached = readCache();
  if (cached) {
    return cached;
  }

  const snapshot = readSnapshot();

  try {
    const repos = await fetchUserRepos(username, token);

    if (repos.length === 0) {
      console.warn("No repos found for user:", username);
      return snapshot ?? [];
    }

    const commitsPerRepo = Math.max(2, Math.ceil(totalLimit / repos.length));

    const allCommitsArrays = await Promise.all(
      repos.map((repo) =>
        fetchRepoCommits(username, repo.name, commitsPerRepo, token)
      )
    );

    const topCommits = allCommitsArrays
      .flat()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, totalLimit);

    if (topCommits.length === 0) {
      return snapshot ?? [];
    }

    const commitsWithStats = await Promise.all(
      topCommits.map(async (commit) => ({
        ...commit,
        filesChanged: await fetchCommitFilesCount(
          username,
          commit.repo,
          commit.sha,
          token
        ),
      }))
    );

    persistCommits(commitsWithStats);

    return commitsWithStats;
  } catch (error) {
    console.error("Failed to fetch latest GitHub commits:", error);
    return snapshot ?? [];
  }
}
