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
  <span class="lines" aria-hidden="true">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </span>
</button>

<style>
  .hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    z-index: 1001;
    margin-right: 1em;

    .lines {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.2em;
      width: 2em;
      height: 1.3em;

      .line {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--accent-bright);
        border-radius: 2px;
        transition: all 0.3s ease;
        transform-origin: center;
      }
    }

    &.open .line {
      &:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    }

    @media (max-width: 767px) {
      display: flex;
      flex: 0 0 auto;
      margin-right: 0;
    }
  }
</style>
