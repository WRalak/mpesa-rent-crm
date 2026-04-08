import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function AdminAnalyticsPage() {
  return (
    <PageShell title="Analytics" description="Track adoption, retention, and payment trends.">
      <SectionCard title="Insights">
        <p className="text-sm text-slate-600">
          Advanced cohort, geography, and growth analytics will appear here.
        </p>
      </SectionCard>
    </PageShell>
  );
}
