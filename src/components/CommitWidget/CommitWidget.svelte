<script lang="ts">
  import { onMount } from "svelte";
  import type { CommitDisplay } from "../../types/github";
  import { fetchLatestCommitsPublic } from "../../lib/github-public";

  type CachedCommits = {
    commits: CommitDisplay[];
    timestamp: number;
  };

  const CACHE_TTL_MS = 15 * 60 * 1000;

  export let initialCommits: CommitDisplay[] = [];
  export let totalLimit: number | undefined = undefined;
  export let username: string;

  let commits = initialCommits;
  let isRefreshing = initialCommits.length === 0;
  let hasError = false;

  function formatCommitDate(date: string): string {
    return new Date(date).toLocaleString("nl-NL", {
      day: "numeric",
      month: "short",
    });
  }

  function getFilesLabel(filesChanged: number): string {
    return `${filesChanged} ${filesChanged === 1 ? "bestand" : "bestanden"}`;
  }

  function readCachedCommits(cacheKey: string): CachedCommits | null {
    try {
      const cached = window.sessionStorage.getItem(cacheKey);

      if (!cached) {
        return null;
      }

      const parsed = JSON.parse(cached) as CachedCommits;

      if (
        !Array.isArray(parsed.commits) ||
        typeof parsed.timestamp !== "number"
      ) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  function writeCachedCommits(
    cacheKey: string,
    nextCommits: CommitDisplay[],
  ): void {
    try {
      const payload: CachedCommits = {
        commits: nextCommits,
        timestamp: Date.now(),
      };

      window.sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch {
      // Ignore storage failures and keep the UI functional.
    }
  }

  onMount(async () => {
    const limit = totalLimit ?? 10;
    const cacheKey = `github-commits:${username}:${limit}`;
    const cached = readCachedCommits(cacheKey);

    if (cached?.commits.length) {
      commits = cached.commits;

      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        isRefreshing = false;
        return;
      }
    }

    isRefreshing = true;

    try {
      const latestCommits = await fetchLatestCommitsPublic(username, limit);

      if (latestCommits.length > 0) {
        commits = latestCommits;
        writeCachedCommits(cacheKey, latestCommits);
      }

      hasError = false;
    } catch (error) {
      console.error("Failed to refresh GitHub commits in browser:", error);
      hasError = true;
    } finally {
      isRefreshing = false;
    }
  });
</script>

<section class="commitsSection">
  <div class="headingRow">
    <div class="title">
      <span class="line"></span>
      <h1>Recente Git commits</h1>
      <span class="line"></span>
    </div>

    {#if isRefreshing}
      <span class="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        Verversen
      </span>
    {/if}
  </div>

  {#if commits.length > 0}
    <div class="commitsCarousel">
      <div class="commitsScrollContainer">
        <div class="commitsTrack">
          {#each commits as commit}
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              class="commitCard"
            >
              <div class="commitHeader">
                <span class="repoName">{commit.repo}</span>
                <code class="sha">{commit.shortSha}</code>
              </div>
              <p class="commitMessage">{commit.title}</p>
              <div class="commitFooter">
                <span class="files">{getFilesLabel(commit.filesChanged)}</span>
                <span>{formatCommitDate(commit.date)}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  {:else if isRefreshing}
    <div class="loadingState" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      GitHub-activiteit laden...
    </div>
  {:else if hasError}
    <div class="emptyState">
      GitHub-activiteit kon niet direct worden ververst. De laatst bekende
      snapshot blijft beschikbaar zodra die aanwezig is.
    </div>
  {:else}
    <div class="emptyState">
      Geen GitHub-activiteit beschikbaar. De site kan nog wel online zijn, maar
      er is op dit moment geen commitdata opgehaald.
    </div>
  {/if}
</section>

<style>
  .commitsSection {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    overflow: hidden;
    width: var(--featured-projects-container-width);
  }

  .headingRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
    flex: 1 1 auto;
  }

  .line {
    flex: 1 1 auto;
    min-width: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.1)
    );
  }

  .title h1 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 1.3rem;
    white-space: nowrap;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .spinner {
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.18);
    border-top-color: var(--accent-bright);
    animation: spin 0.8s linear infinite;
  }

  .commitsCarousel {
    width: 100%;
    overflow: hidden;
    --commits-edge-fade: 3rem;
    mask-image: linear-gradient(
      90deg,
      #000 0,
      #000 calc(100% - var(--commits-edge-fade)),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      90deg,
      #000 0,
      #000 calc(100% - var(--commits-edge-fade)),
      transparent 100%
    );
  }

  .commitsScrollContainer {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    padding: 1em 0;
  }

  .commitsTrack {
    display: flex;
    gap: 1em;
    padding: 0.5em var(--commits-edge-fade) 0.5em 0.5em;
    width: max-content;
  }

  .commitCard {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    min-width: var(--card-width);
    max-width: var(--card-width);
    padding: 1em;
    background: rgb(20, 20, 20);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5em;
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
    flex-shrink: 0;
  }

  .commitCard:hover {
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
  }

  .commitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .repoName {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    color: var(--accent-bright);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 140px;
  }

  .sha {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
  }

  .commitMessage {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    padding: 4px 0;
    text-align: left;
  }

  .commitFooter {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .files {
    font-family: "JetBrains Mono", monospace;
  }

  .loadingState {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    min-height: 10rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-muted);
  }

  .emptyState {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5em;
    padding: 1.25em;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.03);
    line-height: 1.5;
  }

  @media screen and (max-width: 940px) {
    .commitsSection {
      display: none;
    }
  }

  @media screen and (min-width: 1920px) {
    .title h1 {
      font-size: 16px;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
