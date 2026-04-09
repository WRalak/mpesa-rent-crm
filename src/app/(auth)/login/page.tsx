"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { useState, useEffect } from "react";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam === "invalid_credentials") {
      setError("Invalid phone number. Please try again.");
    } else if (errorParam === "user_not_found") {
      setError("Phone number not found. Use a test user above.");
    }
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      setError("Please enter a phone number");
      setLoading(false);
      return;
    }

    try {
      // Check if user exists first
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const userData = await response.json();

      if (!userData.success) {
        setError(userData.error || "Phone number not found");
        setLoading(false);
        return;
      }

      // Determine redirect based on role
      const redirectTo = userData.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

      await signIn("credentials", {
        phone: cleanPhone,
        redirectTo,
      });
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome Back</h1>
      <p className="text-sm text-slate-600 mt-1">Enter your phone number to sign in.</p>
      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={login} className="mt-6 space-y-3">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          inputMode="numeric"
          placeholder="2547XXXXXXXX"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        New landlord?{" "}
        <Link className="font-medium text-slate-900 underline" href="/register">
          Create account
        </Link>
      </p>
      
      {/* Test Users Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Demo - Test Users</h3>
        <div className="space-y-1 text-xs text-blue-700">
          <p><strong>Admin:</strong> 254700000000</p>
          <p><strong>Landlord 1:</strong> 254700000001 (John)</p>
          <p><strong>Landlord 2:</strong> 254700000002 (Jane)</p>
          <p><strong>Landlord 3:</strong> 254700000003 (Bob)</p>
          <p><strong>Landlord 4:</strong> 254700000004 (Alice)</p>
          <p><strong>Landlord 5:</strong> 254700000005 (Test)</p>
        </div>
        <p className="mt-2 text-xs text-blue-600 font-medium">No password needed - just phone number!</p>
      </div>
      </section>
    </main>
  );
}
