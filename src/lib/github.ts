import * as fs from "node:fs";
import * as path from "node:path";
import type { GitHubRepo, GitHubCommit, CommitDisplay } from "../types/github";

const GITHUB_API = "https://api.github.com";

// Cache configuration
const CACHE_DIR = ".cache";
const CACHE_FILE = path.join(CACHE_DIR, "github-commits.json");
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CacheData {
  timestamp: number;
  commits: CommitDisplay[];
}

function readCache(): CommitDisplay[] | null {
  try {
    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    const cache: CacheData = JSON.parse(data);
    if (Date.now() - cache.timestamp < CACHE_TTL_MS) {
      console.log("Using cached GitHub commits");
      return cache.commits;
    }
    console.log("Cache expired, fetching fresh data");
  } catch {
    // Cache doesn't exist or is invalid
  }
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
  }));
}

export async function fetchLatestCommits(
  username: string,
  totalLimit: number = 10,
  token?: string
): Promise<CommitDisplay[]> {
  // Check cache first
  const cached = readCache();
  if (cached) {
    return cached;
  }

  // Fetch all repos for the user
  const repos = await fetchUserRepos(username, token);

  if (repos.length === 0) {
    console.warn("No repos found for user:", username);
    return [];
  }

  // Fetch recent commits from each repo (limit per repo to avoid too many requests)
  const commitsPerRepo = Math.max(2, Math.ceil(totalLimit / repos.length));

  const allCommitsArrays = await Promise.all(
    repos.map((repo) =>
      fetchRepoCommits(username, repo.name, commitsPerRepo, token)
    )
  );

  // Flatten, sort by date (newest first), and limit
  const commits = allCommitsArrays
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, totalLimit);

  // Write to cache
  writeCache(commits);

  return commits;
}
