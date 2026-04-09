import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminLandlordsPage() {
  return (
    <PageShell title="Landlords" description="Manage landlord accounts and tenant portfolio health.">
      <SectionCard title="Account Management">
        <p className="text-sm text-slate-600">Manage landlord accounts and subscriptions.</p>
      </SectionCard>
    </PageShell>
  );
}
