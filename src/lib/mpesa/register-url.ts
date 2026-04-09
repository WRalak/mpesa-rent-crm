import { getMpesaAccessToken } from "@/lib/mpesa/auth";
import { mpesaConfig } from "@/lib/mpesa/config";

type RegisterUrlPayload = {
  validationUrl: string;
  confirmationUrl: string;
};

export async function registerC2bUrls(payload: RegisterUrlPayload) {
  const token = await getMpesaAccessToken();
  const response = await fetch(`${mpesaConfig.baseUrl}/mpesa/c2b/v1/registerurl`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ShortCode: mpesaConfig.shortcode,
      ResponseType: "Completed",
      ConfirmationURL: payload.confirmationUrl,
      ValidationURL: payload.validationUrl,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to register M-Pesa URLs.");
  }

  return (await response.json()) as Record<string, unknown>;
}
