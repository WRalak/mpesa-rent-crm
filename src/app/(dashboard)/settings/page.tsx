import { PageShell, SectionCard } from "@/components/ui/page-shell";
import { CookieSettings } from "@/components/settings/cookie-settings";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Manage profile details, credentials, and notification preferences."
    >
      <div className="space-y-6">
        <SectionCard title="Cookie Settings">
          <p className="text-sm text-slate-600 mb-4">
            Manage your application preferences stored in cookies. These settings are saved locally and persist across sessions.
          </p>
          <CookieSettings />
        </SectionCard>

        <SectionCard title="Account Settings">
          <p className="text-sm text-slate-600">
            Configure profile, M-Pesa credentials, and notifications from this section.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
