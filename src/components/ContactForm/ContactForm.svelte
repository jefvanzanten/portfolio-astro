<script lang="ts">
  import styles from "./ContactForm.module.css";
  import { sendFormToApi } from "../../services/emailService";

  let name = "";
  let email = "";
  let message = "";
  let isLoading = false;
  let status = "";

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    isLoading = true;
    status = "";

    const success = await sendFormToApi({
      name,
      email,
      message,
    });

    isLoading = false;

    if (success) {
      status = "success";
      name = "";
      email = "";
      message = "";
      return;
    }

    status = "error";
  };
</script>

<form on:submit={handleSubmit}>
  <input type="text" placeholder="Naam" bind:value={name} />
  <input type="email" placeholder="jouw@email.com" bind:value={email} />
  <textarea placeholder="Schrijf je bericht hier..." bind:value={message}></textarea>
  <button type="submit" disabled={isLoading}>
    {isLoading ? "Versturen..." : "Verstuur"}
  </button>
  {#if status === "success"}
    <span class="success">Email verstuurd!</span>
  {/if}
  {#if status === "error"}
    <span class={styles.error}>Er ging iets mis, probeer opnieuw</span>
  {/if}
</form>
