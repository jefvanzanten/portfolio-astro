<script lang="ts">
  import { onMount } from "svelte";
  import styles from "./NavBar.module.css";
  import hamburgerStyles from "../Hamburger/Hamburger.module.css";
  import {
    getActiveNavigationItem,
    isNavigationItemActive,
    navigationItems,
  } from "../../lib/navigation";

  export let currentPath: string;

  let isMenuOpen = false;
  let theme: "light" | "dark" = "dark";
  let locale: "nl" | "en" = "nl";

  const applyTheme = (nextTheme: "light" | "dark") => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    theme = nextTheme;
  };

  const applyLocale = (nextLocale: "nl" | "en") => {
    document.documentElement.lang = nextLocale;
    localStorage.setItem("portfolio-locale", nextLocale);
    locale = nextLocale;
  };

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  const closeMenu = () => {
    isMenuOpen = false;
  };

  $: activeItem = getActiveNavigationItem(currentPath);

  onMount(() => {
    const storedTheme = localStorage.getItem("portfolio-theme");
    const storedLocale = localStorage.getItem("portfolio-locale");

    applyTheme(storedTheme === "light" ? "light" : "dark");
    applyLocale(storedLocale === "en" ? "en" : "nl");
  });
</script>

<div class={styles.navcontainer}>
  <nav class={styles.nav}>
    <button
      class={`${hamburgerStyles.hamburger} ${isMenuOpen ? hamburgerStyles.open : ""}`}
      on:click={toggleMenu}
      aria-label="Menu"
    >
      <span class={hamburgerStyles.line}></span>
      <span class={hamburgerStyles.line}></span>
      <span class={hamburgerStyles.line}></span>
    </button>

    <a href="/" class={`${styles.navlink} ${styles.logo}`} on:click={closeMenu}>
      JEFVANZANTEN.DEV
    </a>

    {#if activeItem}
      <a href={activeItem.to} class={styles.pageName}>
        {activeItem.name}
      </a>
    {/if}

    <div class={`${styles.navlist} ${isMenuOpen ? styles.open : ""}`}>
      {#each navigationItems as item}
        <a
          href={item.to}
          class={isNavigationItemActive(currentPath, item.to)
            ? `${styles.navlink} ${styles.active}`
            : styles.navlink}
          on:click={closeMenu}
        >
          {item.name}
        </a>
      {/each}
    </div>
  </nav>
</div>
