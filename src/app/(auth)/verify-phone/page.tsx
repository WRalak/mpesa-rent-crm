"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyPhoneContent() {
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Verify Phone Number</h1>
      <p className="text-sm text-slate-600 mt-1">Complete OTP verification to secure your account.</p>
      <input
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="2547XXXXXXXX"
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2"
      />
      <button onClick={sendOtp} className="mt-3 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
        Send OTP
      </button>

      {requested ? (
        <>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <button onClick={verifyOtp} className="mt-3 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
            Verify
          </button>
        </>
      ) : null}

      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      <p className="mt-4 text-sm text-slate-600">
        Back to{" "}
        <Link className="font-medium text-slate-900 underline" href="/login">
          login
        </Link>
      </p>
      </section>
    </main>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md p-8">Loading verification form...</main>}>
      <VerifyPhoneContent />
    </Suspense>
  );
}
