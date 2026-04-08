import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminSubscriptionsPage() {
  return (
    <PageShell title="Subscriptions" description="Billing operations and subscription lifecycle management.">
      <SectionCard title="Billing Status">
        <p className="text-sm text-slate-600">
          Review active, pending, and failed subscription payments.
        </p>
      </SectionCard>
    </PageShell>
  );
}
