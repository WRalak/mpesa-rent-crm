"use client";

import { useLandlordStats } from "@/hooks/useLandlordStats";
import { formatCurrency } from "@/utils/formatters";

export default function DashboardPage() {
  const { stats, loading, error } = useLandlordStats();

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Landlord Dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">
        Track rent collection, defaulters, and monthly compliance.
      </p>
      {loading ? <p className="mt-3 text-sm text-gray-600">Loading dashboard summary...</p> : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <section className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Properties</p>
          <p className="text-2xl font-bold">{stats.propertiesCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Tenants</p>
          <p className="text-2xl font-bold">{stats.tenantsCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold">{stats.pendingPayments}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-600">Total Collected</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalCollected)}</p>
        </div>
      </section>
    </main>
  );
}
