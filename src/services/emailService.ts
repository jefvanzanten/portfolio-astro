import type { EmailProperties } from "../types/email";

export async function sendFormToApi(email: EmailProperties): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/email/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    return response.ok;
  } catch (error: unknown) {
    console.log("Sending email failed: ", error);
    return false;
  }
}
