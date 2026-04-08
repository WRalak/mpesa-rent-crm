import { PageShell, StatCard } from "@/components/ui/page-shell";

export default function AdminDashboardPage() {
  return (
    <PageShell
      title="Admin Dashboard"
      description="Platform-level view of growth, revenue, and operations."
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Landlords" value="128" />
        <StatCard label="Monthly Revenue" value="KES 1.2M" />
        <StatCard label="Open Incidents" value="2" />
      </section>
    </PageShell>
  );
}
