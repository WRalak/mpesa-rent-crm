type SmsPayload = {
  to: string;
  message: string;
};

export async function sendViaAfricasTalking(payload: SmsPayload) {
  // Placeholder gateway for now; wire real API credentials later.
  console.log("SMS SENT", payload.to, payload.message);
  return { success: true };
}
