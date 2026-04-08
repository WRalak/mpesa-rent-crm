import { NextRequest, NextResponse } from "next/server";
import { enqueueSms, otpTemplate } from "@/lib/sms";

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  const { phone } = (await req.json()) as { phone?: string };
  const normalized = String(phone ?? "").replace(/\D/g, "");
  if (!normalized) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  otpStore.set(normalized, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  await enqueueSms(normalized, otpTemplate(code));
  return NextResponse.json({ success: true });
}

export { otpStore };
