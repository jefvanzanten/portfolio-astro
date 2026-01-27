import { createSignal, type Component } from "solid-js";
import styles from "./ContactForm.module.css";
import { sendFormToApi } from "../../services/emailService";

const ContactForm: Component = () => {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [status, setStatus] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    setIsLoading(true);
    setStatus("");

    const success = await sendFormToApi({
      name: name(),
      email: email(),
      message: message(),
    });

    setIsLoading(false);

    if (success) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      console.log("Email send!");
    } else {
      setStatus("error");
      console.log("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Naam"
        value={name()}
        onInput={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="jouw@email.com"
        value={email()}
        onInput={(e) => setEmail(e.target.value)}
      />
      <textarea
        class={styles["text-area"]}
        placeholder="Schrijf je bericht hier..."
        value={message()}
        onInput={(e) => setMessage(e.target.value)}
      ></textarea>
      <button type="submit" disabled={isLoading()}>
        {isLoading() ? "Versturen..." : "Verstuur"}
      </button>
      {status() === "success" && <span class="success">Email verstuurd!</span>}
      {status() === "error" && (
        <span class="error">Er ging iets mis, probeer opnieuw</span>
      )}
      {/* <span class={styles["error"]}>
        Helaas, de email service is niet live... maar je kan natuurlijk altijd
        handmatig een mailtje sturen 😁
      </span> */}
    </form>
  );
};

export default ContactForm;
