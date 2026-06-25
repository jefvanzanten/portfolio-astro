import type { Component } from "solid-js";
import styles from "./ExternalLinkContent.module.css";

type ExternalLinkContentProps = {
  iconUrl?: string;
  name?: string;
};

const ExternalLinkContent: Component<ExternalLinkContentProps> = (props) => {
  const iconUrl = () => props.iconUrl ?? "/icons/external-link.svg";
  const name = () => props.name ?? "Bekijk live";

  return (
    <span class={styles.content}>
      <img class={styles.icon} src={iconUrl()} alt={`${name()} logo`} />
      <span class={styles.label}>{name()}</span>
    </span>
  );
};

export default ExternalLinkContent;
