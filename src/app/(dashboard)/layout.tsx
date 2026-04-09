import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { SessionProviderWrapper } from "@/components/auth/session-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ToastProvider } from "@/components/ui/toast";
import { NavigationBar } from "@/components/navigation/navigation-bar";
import "../globals.css";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/tenants", label: "Tenants" },
  { href: "/payments", label: "Payments" },
  { href: "/reports", label: "Reports" },
  { href: "/messages", label: "Messages" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <ErrorBoundary>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
              <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="mr-2 text-sm font-semibold text-gray-900">
                    M-Pesa Rent CRM
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={link.href === "/properties" 
                        ? "rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700" 
                        : "rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <LogoutButton />
              </div>
            </header>
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </ToastProvider>
      </ErrorBoundary>
    </SessionProviderWrapper>
  );
}
