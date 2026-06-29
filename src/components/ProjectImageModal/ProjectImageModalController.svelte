<script lang="ts">
  import ProjectImageModal from "./ProjectImageModal.svelte";
  import { closeProjectImage, projectImageState } from "./ProjectImageState.svelte";

  const closeModal = () => {
    closeProjectImage();
  };
</script>

<ProjectImageModal imageUrl={projectImageState.activeImageUrl} onClose={closeModal} />
