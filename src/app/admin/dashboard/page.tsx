"use client";

import { useState, useEffect } from "react";
import { PageShell, StatCard, SectionCard } from "@/components/ui/page-shell";
import { LogoutButton } from "@/components/auth/logout-button";

interface RecentRegistration {
  id: number;
  name: string;
  phone: string;
  registeredAt: string;
}

interface AdminStats {
  totalLandlords: number;
  totalProperties: number;
  totalTenants: number;
  monthlyRevenue: number;
  activeUsers: number;
  totalTransactions: number;
  systemHealth: string;
  recentRegistrations: RecentRegistration[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalLandlords: 0,
    totalProperties: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    totalTransactions: 0,
    systemHealth: "healthy",
    recentRegistrations: []
  });

  useEffect(() => {
    // Simulate loading admin stats
    setStats({
      totalLandlords: 156,
      totalProperties: 1248,
      totalTenants: 3456,
      monthlyRevenue: 2456780,
      activeUsers: 89,
      totalTransactions: 12456,
      systemHealth: "healthy",
      recentRegistrations: [
        { id: 1, name: "John Properties", phone: "254700000001", registeredAt: "2024-01-15" },
        { id: 2, name: "Jane Rentals", phone: "254700000002", registeredAt: "2024-01-14" },
        { id: 3, name: "Bob Estates", phone: "254700000003", registeredAt: "2024-01-13" }
      ]
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageShell
      title="Admin Dashboard"
      description="Platform-level management and analytics"
      actions={<LogoutButton />}
    >
      {/* Platform Overview */}
      <SectionCard title="Platform Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-600">Total Landlords</h3>
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalLandlords}</p>
            <p className="text-xs text-blue-600 mt-1">Active landlords</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-600">Total Properties</h3>
              <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2l.586.586a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.totalProperties}</p>
            <p className="text-xs text-purple-600 mt-1">Registered properties</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-600">Total Tenants</h3>
              <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.totalTenants}</p>
            <p className="text-xs text-green-600 mt-1">Active tenants</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-orange-600">Monthly Revenue</h3>
              <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267.653-.145.998-.145.998 0l2.184 1.427a1.125 1.125 0 001.71.054l1.828-1.418a1 1 0 00.327-1.268l-1.889-1.467A1.125 1.125 0 008.02 8.06l-.22.127zM10.873 16.82l-1.828-1.418a1.125 1.125 0 00-1.71.054l-2.184 1.427a1 1 0 00-.327 1.268l1.889 1.467a1.125 1.125 0 001.887-.645l.22-.127a1.125 1.125 0 00.567-.267c.653-.145.998-.145.998 0l2.184 1.427z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-900">{formatCurrency(stats.monthlyRevenue)}</p>
            <p className="text-xs text-orange-600 mt-1">This month</p>
          </div>
        </div>
      </SectionCard>

      {/* System Health */}
      <SectionCard title="System Health">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h4 className="font-medium text-green-900">System Status</h4>
              <p className="text-sm text-green-600">All systems operational</p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Active Users</h4>
              <p className="text-sm text-blue-600">Currently online</p>
            </div>
            <span className="text-2xl font-bold text-blue-900">{stats.activeUsers}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <h4 className="font-medium text-purple-900">Transactions</h4>
              <p className="text-sm text-purple-600">Total processed</p>
            </div>
            <span className="text-2xl font-bold text-purple-900">{stats.totalTransactions.toLocaleString()}</span>
          </div>
        </div>
      </SectionCard>

      {/* Recent Registrations */}
      <SectionCard title="Recent Landlord Registrations">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Registered</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentRegistrations.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 font-mono text-xs">{user.phone}</td>
                  <td className="py-3 px-4">{user.registeredAt}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Admin Actions */}
      <SectionCard title="Admin Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-3 hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Admin
          </button>
          
          <button className="flex items-center justify-center rounded-lg bg-purple-600 text-white px-4 py-3 hover:bg-purple-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Reports
          </button>
          
          <button className="flex items-center justify-center rounded-lg bg-green-600 text-white px-4 py-3 hover:bg-green-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
          </button>
          
          <button className="flex items-center justify-center rounded-lg bg-orange-600 text-white px-4 py-3 hover:bg-orange-700 transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Logs
          </button>
        </div>
      </SectionCard>
    </PageShell>
  );
}
