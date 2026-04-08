"use client";

import { useEffect, useState } from "react";

type Summary = {
  propertiesCount: number;
  tenantsCount: number;
  pendingPayments: number;
  totalCollected: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      const res = await fetch("/api/dashboard/summary");
      if (!res.ok) {
        setError("Failed to load dashboard data.");
        return;
      }
      setSummary((await res.json()) as Summary);
    }

    void loadSummary();
  }, []);

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Landlord Dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">
        Track rent collection, defaulters, and monthly compliance.
      </p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <section className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Properties</p>
          <p className="text-2xl font-bold">{summary?.propertiesCount ?? "-"}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Tenants</p>
          <p className="text-2xl font-bold">{summary?.tenantsCount ?? "-"}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold">{summary?.pendingPayments ?? "-"}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Total Collected</p>
          <p className="text-2xl font-bold">
            KES {summary ? summary.totalCollected.toFixed(2) : "-"}
          </p>
        </div>
      </section>
    </main>
  );
}
