export const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY ?? "",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET ?? "",
  shortcode: process.env.MPESA_SHORTCODE ?? "",
  passkey: process.env.MPESA_PASSKEY ?? "",
  callbackUrl: process.env.MPESA_CALLBACK_URL ?? "",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke",
};

export function hasMpesaCredentials() {
  return Boolean(
    mpesaConfig.consumerKey &&
      mpesaConfig.consumerSecret &&
      mpesaConfig.shortcode &&
      mpesaConfig.passkey &&
      mpesaConfig.callbackUrl
  );
}
