import { getMpesaAccessToken } from "@/lib/mpesa/auth";
import { mpesaConfig } from "@/lib/mpesa/config";
import { getTimestamp } from "@/lib/mpesa/utils";

export async function queryAccountBalance() {
  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  ).toString("base64");

  const response = await fetch(`${mpesaConfig.baseUrl}/mpesa/accountbalance/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Initiator: process.env.MPESA_INITIATOR ?? "",
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL ?? "",
      CommandID: "AccountBalance",
      PartyA: mpesaConfig.shortcode,
      IdentifierType: "4",
      Remarks: "Account balance query",
      QueueTimeOutURL: mpesaConfig.callbackUrl,
      ResultURL: mpesaConfig.callbackUrl,
      Timestamp: timestamp,
      Password: password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to query M-Pesa account balance.");
  }

  return (await response.json()) as Record<string, unknown>;
}
