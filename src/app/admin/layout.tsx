"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/landlords", label: "Landlords" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="mr-2 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
              Admin Console
            </Link>
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Admin</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
