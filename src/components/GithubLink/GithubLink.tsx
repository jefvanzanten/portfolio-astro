import type { Component } from "solid-js";
import LinkAction from "../LinkAction/LinkAction";
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
  return (
    <LinkAction
      url={props.url}
      label={props.name}
      iconOnly={props.iconOnly}
      variant={props.variant}
      target={props.target}
      rel={props.rel}
    >
      <span class={styles.content}>
        <img
          class={styles.logo}
          src={props.iconUrl}
          alt={`${props.name} logo`}
        />
        {!props.iconOnly && <span class={styles.label}>{props.name}</span>}
      </span>
    </LinkAction>
  );
};

export default GithubLink;
