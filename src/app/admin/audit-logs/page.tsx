import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminAuditLogsPage() {
  return (
    <PageShell title="Audit Logs" description="Trace sensitive actions for compliance and investigations.">
      <SectionCard title="Security Trail">
        <p className="text-sm text-slate-600">
          Track sensitive actions across landlord and admin workflows.
        </p>
      </SectionCard>
    </PageShell>
  );
}
