import { getMpesaAccessToken } from "@/lib/mpesa/auth";
import { mpesaConfig } from "@/lib/mpesa/config";
import { getTimestamp } from "@/lib/mpesa/utils";

export async function queryStkPushStatus(checkoutRequestId: string) {
  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  ).toString("base64");

  const response = await fetch(`${mpesaConfig.baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: mpesaConfig.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to query STK push status.");
  }

  return (await response.json()) as Record<string, unknown>;
}
