"use client";

import { useLandlordStats } from "@/hooks/useLandlordStats";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, StatCard, SectionCard } from "@/components/ui/page-shell";
import { AIInsights } from "@/components/dashboard/ai-insights";

// Fallback data in case of API errors
const fallbackStats = {
  propertiesCount: 0,
  tenantsCount: 0,
  pendingPayments: 0,
  totalCollected: 0,
};

function LoadingSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-2 h-8 w-16 bg-slate-300 rounded animate-pulse"></div>
        </div>
      ))}
    </section>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="ml-4 text-sm font-medium text-red-800 hover:text-red-900 underline"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, loading, error, retry } = useLandlordStats();

  return (
    <PageShell
      title="Landlord Dashboard"
      description="Track rent collection, defaulters, and monthly tax compliance."
    >
      {loading && <LoadingSkeleton />}

      {error && !loading && <ErrorMessage error={error} onRetry={retry} />}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Properties" value={stats.propertiesCount} />
            <StatCard label="Tenants" value={stats.tenantsCount} />
            <StatCard label="Pending Payments" value={stats.pendingPayments} />
            <StatCard label="Total Collected" value={formatCurrency(stats.totalCollected)} />
          </section>

          {/* AI Insights */}
          <SectionCard title="AI-Powered Insights">
            <AIInsights 
              propertiesCount={stats.propertiesCount}
              tenantsCount={stats.tenantsCount}
              totalCollected={stats.totalCollected}
              pendingPayments={stats.pendingPayments}
            />
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button 
                onClick={() => window.location.href = '/properties?action=add'}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="text-lg font-medium text-slate-900">Add Property</div>
                <div className="text-sm text-slate-600 mt-1">Register a new rental property</div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/tenants?action=add'}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="text-lg font-medium text-slate-900">Add Tenant</div>
                <div className="text-sm text-slate-600 mt-1">Register a new tenant</div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/payments?action=add'}
                className="rounded-lg border border-slate-300 bg-white p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="text-lg font-medium text-slate-900">Record Payment</div>
                <div className="text-sm text-slate-600 mt-1">Log a rent payment</div>
              </button>
            </div>
          </SectionCard>
        </div>
      )}
    </PageShell>
  );
}
