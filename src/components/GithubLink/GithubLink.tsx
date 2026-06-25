import type { Component } from "solid-js";
import styles from "./GithubLink.module.css";

type GithubLinkProps = {
  name: string;
  url: string;
  iconUrl: string;
  iconOnly?: boolean;
  variant?: "primary" | "secondary";
  target?: "_blank" | "_self";
  rel?: string;
};

const GithubLink: Component<GithubLinkProps> = (props) => {
  const target = () =>
    props.target ?? (props.url.startsWith("/") ? undefined : "_blank");
  const rel = () =>
    props.rel ?? (target() === "_blank" ? "noreferrer" : undefined);

  return (
    <a
      classList={{
        [styles.socialContainer]: true,
        [styles.iconOnly]: props.iconOnly ?? false,
        [styles.primary]: props.variant === "primary",
      }}
      href={props.url}
      target={target()}
      rel={rel()}
      aria-label={props.name}
      title={props.name}
    >
      <img class={styles.logo} src={props.iconUrl} alt={`${props.name} logo`} />
      {!props.iconOnly && <span class={styles.label}>{props.name}</span>}
    </a>
  );
};

export default GithubLink;
