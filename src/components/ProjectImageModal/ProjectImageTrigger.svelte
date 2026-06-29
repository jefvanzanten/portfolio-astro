<script lang="ts">
  import { projectImageStore } from "./ProjectImageStore";

  export let imageUrl = "";
  export let ariaLabel = "Open project screenshot";
  export let className = "";

  const openImage = (event: MouseEvent) => {
    event.preventDefault();
    projectImageStore.open(imageUrl);
  };
</script>

<a href={imageUrl} class={className} aria-label={ariaLabel} on:click={openImage}>
  <slot />
</a>
