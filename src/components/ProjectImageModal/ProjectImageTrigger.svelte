<script lang="ts">
  import { openProjectImage } from "./ProjectImageState.svelte";

  export let imageUrl = "";
  export let ariaLabel = "Open project screenshot";
  export let className = "";

  const openImage = (event: MouseEvent) => {
    event.preventDefault();
    openProjectImage(imageUrl);
  };
</script>

<a href={imageUrl} class={className} aria-label={ariaLabel} on:click={openImage}>
  <slot />
</a>
