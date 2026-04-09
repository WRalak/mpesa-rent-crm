import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function MessagesPage() {
  return (
    <PageShell
      title="Messages"
      description="Send reminders and keep communication centralized."
    >
      <SectionCard title="SMS Campaigns">
        <p className="text-sm text-slate-600">
          Bulk SMS reminders and tenant communication tools live here.
        </p>
      </SectionCard>
    </PageShell>
  );
}
