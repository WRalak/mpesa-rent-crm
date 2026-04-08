import { mpesaConfig } from "@/lib/mpesa/config";

type AccessTokenResponse = {
  access_token: string;
};

export async function getMpesaAccessToken() {
  const credentials = Buffer.from(
    `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
  ).toString("base64");

  const response = await fetch(
    `${mpesaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate with Daraja API.");
  }

  const data = (await response.json()) as AccessTokenResponse;
  return data.access_token;
}
