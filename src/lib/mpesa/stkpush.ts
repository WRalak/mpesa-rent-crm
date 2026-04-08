import { getMpesaAccessToken } from "@/lib/mpesa/auth";
import { mpesaConfig } from "@/lib/mpesa/config";
import { StkPushPayload, StkPushResponse } from "@/lib/mpesa/types";
import { getTimestamp, normalizePhone } from "@/lib/mpesa/utils";

export async function requestStkPush(
  payload: StkPushPayload
): Promise<StkPushResponse> {
  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  ).toString("base64");

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: payload.amount,
        PartyA: normalizePhone(payload.phone),
        PartyB: mpesaConfig.shortcode,
        PhoneNumber: normalizePhone(payload.phone),
        CallBackURL: mpesaConfig.callbackUrl,
        AccountReference: payload.accountReference,
        TransactionDesc: payload.transactionDesc,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("STK push request failed.");
  }

  return (await response.json()) as StkPushResponse;
}
