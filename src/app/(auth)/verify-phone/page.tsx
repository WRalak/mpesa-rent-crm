"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPhonePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [phone, setPhone] = useState(() => params.get("phone") ?? "");
  const [code, setCode] = useState("");
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState("");

  async function sendOtp() {
    setMessage("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (res.ok) {
      setRequested(true);
      setMessage("OTP sent. Check your SMS.");
    } else {
      setMessage("Failed to send OTP.");
    }
  }

  async function verifyOtp() {
    setMessage("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    if (res.ok) {
      setMessage("Phone verified.");
      router.push("/login");
    } else {
      const data = (await res.json()) as { error?: string };
      setMessage(data.error ?? "Verification failed.");
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Verify Phone</h1>
      <p className="text-sm text-gray-600 mt-1">Complete OTP verification.</p>
      <input
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="2547XXXXXXXX"
        className="mt-4 w-full rounded-md border px-3 py-2"
      />
      <button onClick={sendOtp} className="mt-3 rounded-md bg-black text-white px-4 py-2">
        Send OTP
      </button>

      {requested ? (
        <>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="mt-4 w-full rounded-md border px-3 py-2"
          />
          <button onClick={verifyOtp} className="mt-3 rounded-md bg-black text-white px-4 py-2">
            Verify
          </button>
        </>
      ) : null}

      {message ? <p className="mt-3 text-sm">{message}</p> : null}
      <p className="mt-3 text-sm">
        Back to{" "}
        <Link className="underline" href="/login">
          login
        </Link>
      </p>
    </main>
  );
}
