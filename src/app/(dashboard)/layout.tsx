import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-6 py-4">
          <Link href="/dashboard" className="mr-2 text-sm font-semibold text-gray-900">
            M-Pesa Rent CRM
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}
