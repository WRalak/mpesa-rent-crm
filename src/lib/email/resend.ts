type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(payload: EmailPayload) {
  // Placeholder transport until a provider is configured.
  console.log("EMAIL SENT", payload.to, payload.subject);
  return { success: true };
}
