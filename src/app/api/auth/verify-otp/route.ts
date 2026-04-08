import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/app/api/auth/send-otp/route";

export async function POST(req: NextRequest) {
  const { phone, code } = (await req.json()) as {
    phone?: string;
    code?: string;
  };
  const normalized = String(phone ?? "").replace(/\D/g, "");
  const saved = otpStore.get(normalized);

  if (!saved) {
    return NextResponse.json({ error: "OTP not found" }, { status: 404 });
  }
  if (Date.now() > saved.expiresAt) {
    otpStore.delete(normalized);
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }
  if (saved.code !== String(code ?? "")) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  otpStore.delete(normalized);
  return NextResponse.json({ success: true });
}
