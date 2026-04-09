import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminSupportPage() {
  return (
    <PageShell title="Support" description="Respond to landlord tickets and operational issues.">
      <SectionCard title="Ticket Queue">
        <p className="text-sm text-slate-600">Manage support tickets and landlord inquiries.</p>
      </SectionCard>
    </PageShell>
  );
}
