import styles from "./NavBar.module.css";
import Hamburger from "../Hamburger/Hamburger";
import { For, Show, createSignal, onMount, type Component } from "solid-js";
import useNav from "../../hooks/useNav";

interface NavigationProps {
  currentPath: string;
}

const Navigation: Component<NavigationProps> = (props) => {
  const { toggleMenu, closeMenu, isMenuOpen, activeItem, isActive, navItems } =
    useNav(props.currentPath);
  const [theme, setTheme] = createSignal<"light" | "dark">("dark");
  const [locale, setLocale] = createSignal<"nl" | "en">("nl");

  const applyTheme = (nextTheme: "light" | "dark") => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    setTheme(nextTheme);
  };

  const applyLocale = (nextLocale: "nl" | "en") => {
    document.documentElement.lang = nextLocale;
    localStorage.setItem("portfolio-locale", nextLocale);
    setLocale(nextLocale);
  };

  onMount(() => {
    const storedTheme = localStorage.getItem("portfolio-theme");
    const storedLocale = localStorage.getItem("portfolio-locale");

    applyTheme(storedTheme === "light" ? "light" : "dark");
    applyLocale(storedLocale === "en" ? "en" : "nl");
  });

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

          {/* <div class={styles.controls}>
            <button
              type="button"
              class={styles.themeToggle}
              aria-label={`Switch to ${theme() === "dark" ? "light" : "dark"} mode`}
              aria-pressed={theme() === "light"}
              onClick={() =>
                applyTheme(theme() === "dark" ? "light" : "dark")
              }
            >
              <span class={styles.themeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75ZM5.5 11.25a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1 0-1.5h1.5Zm16 0a.75.75 0 0 1 0 1.5H20a.75.75 0 0 1 0-1.5h1.5ZM7.05 6a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L7.05 7.06A.75.75 0 0 1 7.05 6Zm8.78 8.78a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm2.12-8.78a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm-8.78 8.78a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Z" />
                </svg>
              </span>
              <span class={styles.themeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M14.5 3.25a.75.75 0 0 1 .79.94 7.25 7.25 0 0 0 8.52 9.12.75.75 0 0 1 .77 1.19A10 10 0 1 1 13.3 2.48a.75.75 0 0 1 1.2.77Z" />
                </svg>
              </span>
              <span
                class={`${styles.themeThumb} ${
                  theme() === "light" ? styles.themeLight : styles.themeDark
                }`}
                aria-hidden="true"
              />
            </button>

            <div class={styles.languageSwitcher} aria-label="Language switcher">
              <button
                type="button"
                class={`${styles.languageButton} ${
                  locale() === "nl" ? styles.languageActive : ""
                }`}
                aria-pressed={locale() === "nl"}
                onClick={() => applyLocale("nl")}
              >
                NL
              </button>
              <button
                type="button"
                class={`${styles.languageButton} ${
                  locale() === "en" ? styles.languageActive : ""
                }`}
                aria-pressed={locale() === "en"}
                onClick={() => applyLocale("en")}
              >
                ENG
              </button>
            </div>

          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
