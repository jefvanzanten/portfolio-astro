<script lang="ts">
  import ProjectImageModal from "./ProjectImageModal.svelte";
  import { projectImageStore } from "./ProjectImageStore";

  const closeModal = () => {
    projectImageStore.close();
  };
</script>

<ProjectImageModal imageUrl={$projectImageStore.activeImageUrl} onClose={closeModal} />
