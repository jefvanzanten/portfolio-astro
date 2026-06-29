<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let imageUrl = "";
  export let onClose: () => void;

  let dialogElement: HTMLDialogElement | undefined;
  let isOpen = false;
  let mounted = false;
  let previousBodyOverflow = "";
  let previousHtmlOverflow = "";

  const lockScroll = (locked: boolean) => {
    if (locked) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
  };

  const closeModal = () => {
    dialogElement?.close();
  };

  const handleDialogClose = () => {
    isOpen = false;
    lockScroll(false);
    onClose();
  };

  $: if (mounted && dialogElement && imageUrl && !isOpen) {
    lockScroll(true);
    dialogElement.showModal();
    isOpen = true;
  }

  $: if (mounted && dialogElement && !imageUrl && isOpen) {
    dialogElement.close();
  }

  onMount(() => {
    mounted = true;
  });

  onDestroy(() => {
    if (mounted) {
      lockScroll(false);
    }
  });
</script>

<dialog
  bind:this={dialogElement}
  class="project-image-modal"
  on:close={handleDialogClose}
  on:click={(event) => {
    if (event.target === dialogElement) {
      closeModal();
    }
  }}
>
  <div class="project-image-frame">
    <button
      type="button"
      class="project-image-close"
      aria-label="Sluit screenshot"
      on:click={closeModal}
    >
      X
    </button>
    <img src={imageUrl} alt="Project screenshot" class="project-image" />
  </div>
</dialog>

<style>
  .project-image-modal {
    border: none;
    position: fixed;
    inset: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    background: transparent;
    overflow: hidden;
    z-index: 999;
  }

  .project-image-modal::backdrop {
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
  }

  .project-image-modal:not([open]) {
    display: none;
  }

  .project-image-modal[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-image-frame {
    position: relative;
    width: min(92vw, 1200px);
    max-height: 88vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-image-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    background: rgb(145, 64, 64);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.4em 0.6em;
    cursor: pointer;
  }

  .project-image {
    display: block;
    max-width: 100%;
    max-height: 88vh;
    object-fit: contain;
    border-radius: 1em;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
</style>
