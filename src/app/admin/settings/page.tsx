import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminSettingsPage() {
  return (
    <PageShell title="Admin Settings" description="Configure global billing and platform defaults.">
      <SectionCard title="Platform Configuration">
        <p className="text-sm text-slate-600">Configure system-wide M-Pesa and billing defaults.</p>
      </SectionCard>
    </PageShell>
  );
}
