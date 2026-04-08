import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Manage profile details, credentials, and notification preferences."
    >
      <SectionCard title="Configuration">
        <p className="text-sm text-slate-600">
          Configure profile, M-Pesa credentials, and notifications from this section.
        </p>
      </SectionCard>
    </PageShell>
  );
}
