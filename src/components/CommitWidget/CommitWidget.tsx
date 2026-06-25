import { For, Match, Show, Switch, createSignal, onMount, type Component } from "solid-js";
import type { CommitDisplay } from "../../types/github";
import { fetchLatestCommitsPublic } from "../../lib/github-public";
import styles from "./CommitWidget.module.css";

type CommitWidgetProps = {
  initialCommits: CommitDisplay[];
  totalLimit?: number;
  username: string;
};

type CachedCommits = {
  commits: CommitDisplay[];
  timestamp: number;
};

const CACHE_TTL_MS = 15 * 60 * 1000;

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

    if (!Array.isArray(parsed.commits) || typeof parsed.timestamp !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCommits(cacheKey: string, commits: CommitDisplay[]): void {
  try {
    window.sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        commits,
        timestamp: Date.now(),
      } satisfies CachedCommits),
    );
  } catch {
    // Ignore storage failures and keep the UI functional.
  }
}

const CommitWidget: Component<CommitWidgetProps> = (props) => {
  const [commits, setCommits] = createSignal(props.initialCommits);
  const [isRefreshing, setIsRefreshing] = createSignal(props.initialCommits.length === 0);
  const [hasError, setHasError] = createSignal(false);

  onMount(async () => {
    const totalLimit = props.totalLimit ?? 10;
    const cacheKey = `github-commits:${props.username}:${totalLimit}`;
    const cached = readCachedCommits(cacheKey);

    if (cached?.commits.length) {
      setCommits(cached.commits);

      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        setIsRefreshing(false);
        return;
      }
    }

    setIsRefreshing(true);

    try {
      const latestCommits = await fetchLatestCommitsPublic(props.username, totalLimit);

      if (latestCommits.length > 0) {
        setCommits(latestCommits);
        writeCachedCommits(cacheKey, latestCommits);
      }

      setHasError(false);
    } catch (error) {
      console.error("Failed to refresh GitHub commits in browser:", error);
      setHasError(true);
    } finally {
      setIsRefreshing(false);
    }
  });

  return (
    <section class={styles.commitsSection}>
      <div class={styles.headingRow}>
        <div class={styles.title}>
          <span class={styles.line}></span>
          <h1>Recente Git commits</h1>
          <span class={styles.line}></span>
        </div>
        <Show when={isRefreshing()}>
          <span class={styles.status} aria-live="polite">
            <span class={styles.spinner} aria-hidden="true"></span>
            Verversen
          </span>
        </Show>
      </div>

      <Switch>
        <Match when={commits().length > 0}>
          <div class={styles.commitsCarousel}>
            <div class={styles.commitsScrollContainer}>
              <div class={styles.commitsTrack}>
                <For each={commits()}>
                  {(commit) => (
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
                  )}
                </For>
              </div>
            </div>
          </div>
        </Match>
        <Match when={isRefreshing()}>
          <div class={styles.loadingState} aria-live="polite">
            <span class={styles.spinner} aria-hidden="true"></span>
            GitHub-activiteit laden...
          </div>
        </Match>
        <Match when={hasError()}>
          <div class={styles.emptyState}>
            GitHub-activiteit kon niet direct worden ververst. De laatst bekende
            snapshot blijft beschikbaar zodra die aanwezig is.
          </div>
        </Match>
        <Match when={true}>
          <div class={styles.emptyState}>
            Geen GitHub-activiteit beschikbaar. De site kan nog wel online zijn,
            maar er is op dit moment geen commitdata opgehaald.
          </div>
        </Match>
      </Switch>
    </section>
  );
};

export default CommitWidget;
