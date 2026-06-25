import type { ParentComponent } from "solid-js";
import styles from "./LinkAction.module.css";

type LinkActionProps = {
  url: string;
  label: string;
  iconOnly?: boolean;
  variant?: "primary" | "secondary";
  target?: "_blank" | "_self";
  rel?: string;
};

const LinkAction: ParentComponent<LinkActionProps> = (props) => {
  const target = () =>
    props.target ?? (props.url.startsWith("/") ? undefined : "_blank");
  const rel = () =>
    props.rel ?? (target() === "_blank" ? "noreferrer" : undefined);

  return (
    <a
      classList={{
        [styles.linkAction]: true,
        [styles.iconOnly]: props.iconOnly ?? false,
        [styles.primary]: props.variant === "primary",
      }}
      href={props.url}
      target={target()}
      rel={rel()}
      aria-label={props.label}
      title={props.label}
    >
      {props.children}
    </a>
  );
};

export default LinkAction;
