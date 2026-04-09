"use client";

import { useLandlordStats } from "@/hooks/useLandlordStats";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, StatCard, SectionCard } from "@/components/ui/page-shell";
import { AIInsights } from "@/components/dashboard/ai-insights";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="mt-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-red-800">Dashboard Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, loading, error, retry, retryCount } = useLandlordStats();

  return (
    <PageShell
      title="Landlord Dashboard"
      description="Manage your properties, tenants, and rent collection efficiently."
    >
      {loading && <LoadingSkeleton />}
      {error && !loading && <ErrorMessage error={error} onRetry={retry} />}
      
      {!loading && !error && (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="text-gray-600 mt-2">Track your rental business efficiently</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 011-1h3a1 1 0 011-1v-4a1 1 0 011-1h2a1 1 0 011-1v-4a1 1 0 011-1h-3m-6 0a1 1 0 00-1h2a1 1 0 011-1v-4a1 1 0 011-1h-2m-6 0a1 1 0 00-1h2a1 1 0 011-1v-4a1 1 0 011-1h-2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.propertiesCount}</h3>
                  <p className="text-sm text-gray-600">Properties</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.tenantsCount}</h3>
                  <p className="text-sm text-gray-600">Tenants</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v13m0 0v-13m0 0v13m0 0v-13m0 0v-13m0 0v-13" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</h3>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 .895-3 3s-1.343 3-3 3 3 .895 1.343 3 3-.895 1.343 3-3-.895 1.343-3 3zm0 8c-1.11 0 2.08.402 2.599 1M12 8V7m0 0v13m0 0v13m0 0v-13" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCollected)}</h3>
                  <p className="text-sm text-gray-600">Collected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => window.location.href = '/properties'}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 text-left hover:from-blue-600 to-blue-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2-2h-2m2 0v-16m-2 0v16m2 0v-16m-2 0v16m2 0v-16m-2 0v16" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold">Properties</h4>
                    <p className="text-sm opacity-90">Manage your properties</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/tenants?action=add'}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 text-left hover:from-purple-600 to-purple-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold">Add Tenant</h4>
                    <p className="text-sm opacity-90">Register new tenant</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/payments?action=add'}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 text-left hover:from-green-600 to-green-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 9V2a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0" />
                    <path d="M9 9a3 3 0 100-6 0 3 3 0 016 0" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold">Record Payment</h4>
                    <p className="text-sm opacity-90">Log rent payment</p>
                  </div>
                </div>
              </button>
            </div>
          </SectionCard>

          {/* Recent Activity */}
          <SectionCard title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">New property added</p>
                    <p className="text-sm text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Sunset Apartments</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Payment received</p>
                    <p className="text-sm text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">KES 15,000 from John Doe</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">New tenant registered</p>
                    <p className="text-sm text-gray-500">10 minutes ago</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Jane Smith - Unit A-101</div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </PageShell>
  );
}
