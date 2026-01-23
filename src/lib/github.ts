import * as fs from "node:fs";
import * as path from "node:path";
import type { GitHubRepo, GitHubCommit, CommitDisplay, GitHubEvent } from "../types/github";

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
  const topCommits = allCommitsArrays
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, totalLimit);

  // Fetch file counts for the top commits
  const commitsWithStats = await Promise.all(
    topCommits.map(async (commit) => ({
      ...commit,
      filesChanged: await fetchCommitFilesCount(username, commit.repo, commit.sha, token),
    }))
  );

  // Write to cache
  writeCache(commitsWithStats);

  return commitsWithStats;
}

interface PushEventPayload {
  head: string;
  before: string;
  ref: string;
  commits?: Array<{
    sha: string;
    message: string;
  }>;
}

/**
 * Fetch latest commits via the Events API (hybrid approach)
 * 1. Get PushEvents to find repos with recent activity
 * 2. Fetch commit details for each push's head SHA
 * More efficient than fetching all repos when you have many repos
 */
export async function fetchLatestCommitsViaEvents(
  username: string,
  totalLimit: number = 10,
  token?: string
): Promise<CommitDisplay[]> {
  // Check cache first
  const cached = readCache();
  if (cached) {
    return cached;
  }

  const headers = getHeaders(token);
  const url = `${GITHUB_API}/users/${username}/events/public?per_page=30`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error(`GitHub Events API error: ${response.status}`);
    return [];
  }

  const events: GitHubEvent[] = await response.json();

  // Get unique push events (dedupe by head SHA to avoid duplicate commits)
  const seenShas = new Set<string>();
  const pushEventsToFetch: Array<{ repoFullName: string; headSha: string; createdAt: string; actor: GitHubEvent["actor"] }> = [];

  for (const event of events) {
    if (event.type !== "PushEvent") continue;

    const payload = event.payload as PushEventPayload;
    if (!payload.head || seenShas.has(payload.head)) continue;

    seenShas.add(payload.head);
    pushEventsToFetch.push({
      repoFullName: event.repo.name,
      headSha: payload.head,
      createdAt: event.created_at,
      actor: event.actor,
    });

    // Only fetch enough to get our limit
    if (pushEventsToFetch.length >= totalLimit) break;
  }

  // Fetch commit details for each head SHA
  const commits: CommitDisplay[] = [];

  for (const pushEvent of pushEventsToFetch) {
    const [owner, repo] = pushEvent.repoFullName.split("/");
    const commitUrl = `${GITHUB_API}/repos/${owner}/${repo}/commits/${pushEvent.headSha}`;

    const commitResponse = await fetch(commitUrl, { headers });
    if (!commitResponse.ok) continue;

    const commitData = await commitResponse.json();

    commits.push({
      sha: commitData.sha,
      shortSha: commitData.sha.substring(0, 7),
      message: commitData.commit.message,
      title: commitData.commit.message.split("\n")[0].substring(0, 72),
      author: commitData.author?.login ?? commitData.commit.author.name,
      date: commitData.commit.author.date,
      url: commitData.html_url,
      avatarUrl: commitData.author?.avatar_url ?? pushEvent.actor.avatar_url,
      repo: repo,
      filesChanged: commitData.files?.length ?? 0,
    });

    if (commits.length >= totalLimit) break;
  }

  // Sort by date (newest first)
  commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Write to cache
  writeCache(commits);

  return commits;
}
