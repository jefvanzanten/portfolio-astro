import styles from "./NavBar.module.css";
import Hamburger from "../Hamburger/Hamburger";
import { For, Show, type Component } from "solid-js";
import useNav from "../../hooks/useNav";

interface NavigationProps {
  currentPath: string;
}

const Navigation: Component<NavigationProps> = (props) => {
  const { toggleMenu, closeMenu, isMenuOpen, activeItem, isActive, navItems } =
    useNav(props.currentPath);

  return (
    <div class={styles.navcontainer}>
      <nav class={styles.nav}>
        <Hamburger isOpen={isMenuOpen()} onClick={toggleMenu} />
        <a
          href="/"
          class={`${styles.navlink} ${styles.logo}`}
          onClick={closeMenu}
        >
          JEFVANZANTEN.DEV
        </a>
        <Show when={activeItem()}>
          {(item) => (
            <a href={item().to} class={styles.pageName}>
              {item().name}
            </a>
          )}
        </Show>

        <div class={`${styles.navlist} ${isMenuOpen() ? styles.open : ""}`}>
          <For each={navItems}>
            {(item) => (
              <a
                href={item.to}
                class={
                  isActive(item.to)
                    ? `${styles.navlink} ${styles.active}`
                    : styles.navlink
                }
                onClick={closeMenu}
              >
                {item.name}
              </a>
            )}
          </For>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
