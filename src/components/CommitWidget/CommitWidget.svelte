<script lang="ts">
  import { onMount } from "svelte";
  import type { CommitDisplay } from "../../types/github";
  import { fetchLatestCommitsPublic } from "../../lib/github-public";
  import styles from "./CommitWidget.module.css";

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

<section class={styles.commitsSection}>
  <div class={styles.headingRow}>
    <div class={styles.title}>
      <span class={styles.line}></span>
      <h1>Recente Git commits</h1>
      <span class={styles.line}></span>
    </div>

    {#if isRefreshing}
      <span class={styles.status} aria-live="polite">
        <span class={styles.spinner} aria-hidden="true"></span>
        Verversen
      </span>
    {/if}
  </div>

  {#if commits.length > 0}
    <div class={styles.commitsCarousel}>
      <div class={styles.commitsScrollContainer}>
        <div class={styles.commitsTrack}>
          {#each commits as commit}
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              class={styles.commitCard}
            >
              <div class={styles.commitHeader}>
                <span class={styles.repoName}>{commit.repo}</span>
                <code class={styles.sha}>{commit.shortSha}</code>
              </div>
              <p class={styles.commitMessage}>{commit.title}</p>
              <div class={styles.commitFooter}>
                <span class={styles.files}>{getFilesLabel(commit.filesChanged)}</span>
                <span>{formatCommitDate(commit.date)}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  {:else if isRefreshing}
    <div class={styles.loadingState} aria-live="polite">
      <span class={styles.spinner} aria-hidden="true"></span>
      GitHub-activiteit laden...
    </div>
  {:else if hasError}
    <div class={styles.emptyState}>
      GitHub-activiteit kon niet direct worden ververst. De laatst bekende
      snapshot blijft beschikbaar zodra die aanwezig is.
    </div>
  {:else}
    <div class={styles.emptyState}>
      Geen GitHub-activiteit beschikbaar. De site kan nog wel online zijn, maar
      er is op dit moment geen commitdata opgehaald.
    </div>
  {/if}
</section>
