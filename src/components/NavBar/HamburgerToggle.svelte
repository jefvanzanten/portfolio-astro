<script lang="ts">
  import { onMount } from "svelte";

  export let rootSelector = "[data-mobile-nav]";

  let isOpen = false;
  let buttonElement: HTMLButtonElement | undefined;

  const syncRootState = () => {
    const root = buttonElement?.closest(rootSelector);

    if (!(root instanceof HTMLElement)) {
      return;
    }

    root.dataset.open = isOpen ? "true" : "false";
  };

  const toggleMenu = () => {
    isOpen = !isOpen;
    syncRootState();
  };

  onMount(() => {
    syncRootState();
  });
</script>

<button
  bind:this={buttonElement}
  class={`hamburger ${isOpen ? "open" : ""}`}
  type="button"
  aria-label="Menu"
  aria-expanded={isOpen}
  on:click={toggleMenu}
>
  <span class="line"></span>
  <span class="line"></span>
  <span class="line"></span>
</button>

<style>
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    gap: 0.5em;
    width: 2.5em;
    height: 1.5em;
    background: transparent;
    border: none;
    z-index: 1001;
    margin-right: 1em;
  }

  .line {
    width: 100%;
    height: 3px;
    background-color: rgba(12, 217, 224, 1);
    transition: all 0.3s ease;
    transform-origin: center;
    display: block;
    border-radius: 2px;
  }

  .hamburger.open .line:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }

  .hamburger.open .line:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open .line:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  @media (max-width: 940px) {
    .hamburger {
      display: flex;
    }
  }
</style>
