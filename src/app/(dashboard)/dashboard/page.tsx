"use client";

import { useLandlordStats } from "@/hooks/useLandlordStats";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, StatCard } from "@/components/ui/page-shell";

export default function DashboardPage() {
  const { stats, loading, error } = useLandlordStats();

  return (
    <PageShell
      title="Landlord Dashboard"
      description="Track rent collection, defaulters, and monthly tax compliance."
    >
      {loading ? <p className="mt-3 text-sm text-gray-600">Loading dashboard summary...</p> : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Properties" value={stats.propertiesCount} />
        <StatCard label="Tenants" value={stats.tenantsCount} />
        <StatCard label="Pending Payments" value={stats.pendingPayments} />
        <StatCard label="Total Collected" value={formatCurrency(stats.totalCollected)} />
      </section>
    </PageShell>
  );
}
