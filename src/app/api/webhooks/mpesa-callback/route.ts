import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type CallbackMetadataItem = {
  Name: string;
  Value?: string | number;
};

function getMeta(
  metadata: CallbackMetadataItem[] | undefined,
  name: string
): string {
  const found = metadata?.find((item) => item.Name === name)?.Value;
  return found !== undefined ? String(found) : "";
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const body = payload?.Body?.stkCallback;

  if (!body) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid payload" });
  }

  const metadata = body?.CallbackMetadata?.Item as CallbackMetadataItem[] | undefined;
  const receipt = getMeta(metadata, "MpesaReceiptNumber");
  const phone = getMeta(metadata, "PhoneNumber");
  const amount = Number(getMeta(metadata, "Amount") || 0);

  // We reconcile by most recent pending payment for callback phone+amount.
  const pending = await db.payment.findFirst({
    where: {
      status: "PENDING",
      phoneNumber: phone,
      amount,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!pending) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  await db.payment.update({
    where: { id: pending.id },
    data: {
      status: body.ResultCode === 0 ? "SUCCESS" : "FAILED",
      mpesaReceipt: receipt || null,
      paidAt: body.ResultCode === 0 ? new Date() : null,
    },
  });

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
