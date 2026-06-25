import styles from "./ProjectCard.module.css";
import { For, onMount, type Component } from "solid-js";
import GithubLink from "../GithubLink/GithubLink";
import LinkAction from "../LinkAction/LinkAction";
import ExternalLinkContent from "../ExternalLinkContent/ExternalLinkContent";
import type { Project } from "../../types/project";
import ImageButton from "../ImageButton/ImageButton";

type ProjectCardProps = {
  project: Project;
  index?: number;
  priority?: boolean;
};

const ProjectCard: Component<ProjectCardProps> = (props) => {
  let cardRef: HTMLElement | undefined;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = props.project.coverUrl;
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" },
    );

    if (cardRef) {
      observer.observe(cardRef);
    }

    return () => observer.disconnect();
  });

  return (
    <>
      <article
        ref={cardRef}
        style={{ "--card-index": props.index ?? 0 }}
        class={styles["project-card-container"]}
      >
        <ImageButton project={props.project} priority={props.priority} />
        <section class={styles["project-info"]}>
          <h2 class={styles.title}>{props.project.name}</h2>
          <div
            class={styles.description}
            innerHTML={props.project.descriptionHtml}
          />
        </section>
        <div class={styles["tag-container"]}>
          <For each={props.project.languages}>
            {(language) => <span class={styles.tag}>{language}</span>}
          </For>
          <For each={props.project.libraries}>
            {(library) => <span class={styles.tag}>{library}</span>}
          </For>
        </div>
        {(props.project.url ||
          props.project.liveUrl ||
          props.project.downloadUrl) && (
          <div class={styles["card-actions"]}>
            {props.project.url && (
              <GithubLink
                name="GitHub"
                iconUrl="/icons/github-mark-white.svg"
                url={props.project.url}
              />
            )}
            {props.project.liveUrl && (
              <LinkAction url={props.project.liveUrl} label="Bekijk live">
                <ExternalLinkContent />
              </LinkAction>
            )}
          </div>
        )}
      </article>
    </>
  );
};

export default ProjectCard;
