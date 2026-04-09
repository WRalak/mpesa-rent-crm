"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/auth/logout-button";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (session) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-8">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {session.user?.name || session.user?.phone}!
              </h1>
              <p className="mt-2 text-slate-600">
                You're logged in to your M-Pesa Rent CRM dashboard.
              </p>
            </div>
            <LogoutButton />
          </div>
          
          <div className="mt-8">
            <Link 
              href="/dashboard" 
              className="inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <h3 className="font-medium text-slate-900">Properties</h3>
              <p className="mt-1">Manage your rental properties</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <h3 className="font-medium text-slate-900">Tenants</h3>
              <p className="mt-1">Track tenant information and payments</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <h3 className="font-medium text-slate-900">Reports</h3>
              <p className="mt-1">Generate tax and financial reports</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-8">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          M-Pesa + Landlord CRM
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Modern rent collection and compliance in one dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Collect rent, monitor defaulters, run M-Pesa STK pushes, and generate monthly eRITS tax
          summaries without spreadsheets.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            Login
          </Link>
          <Link href="/register" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Create Account
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            View Demo Dashboard
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Instant M-Pesa payment requests</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Tenant and property tracking</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Monthly eRITS tax report support</div>
        </div>
      </section>
    </main>
  );
}
