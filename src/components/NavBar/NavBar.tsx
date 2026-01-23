import styles from "./NavBar.module.css";
import Hamburger from "../Hamburger/Hamburger";
import { createSignal, For, createMemo, Show, type Component } from "solid-js";

interface NavigationProps {
  currentPath: string; // Wordt doorgegeven vanuit Astro
}

const Navigation: Component<NavigationProps> = (props) => {
  // state used for the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  // Fallback naar "/" als currentPath niet is doorgegeven
  const currentPath = () => props.currentPath ?? "/";

  const navItems = [
    { to: "/projects", name: "Projecten" },
    { to: "/contact", name: "Contact" },
  ];

  // Save the active navigation item in a variable
  const activeItem = createMemo(() => {
    const path = currentPath();

    // If on homepage, return null (no active item to display)
    if (path === "/") return null;

    // Check for exact match first
    const exactMatch = navItems.find((item) => item.to === path);
    if (exactMatch) return exactMatch;

    // Then check for path prefix (for nested routes)
    const prefixMatch = navItems.find((item) => path.startsWith(item.to));

    return prefixMatch ?? null;
  });

  // Toggle function for the hamburger menu
  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen);

  // If the menu is toggled and the user clicked a link it needs to close the menu
  const closeMenu = () => setIsMenuOpen(false);

  // Check of een link actief is (voor styling)
  const isActive = (linkPath: string) => {
    const path = currentPath();
    if (linkPath === "/") {
      return path === "/";
    }
    return path.startsWith(linkPath);
  };

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
