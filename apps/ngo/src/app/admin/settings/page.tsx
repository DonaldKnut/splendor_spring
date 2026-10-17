import { requirePermission } from "@/lib/rbac";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/forms";
import { Card, PageHeader } from "@/components/ui";

export default async function SettingsPage() {
  await requirePermission("manage_settings");
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Organisation settings" />
      <Card>
        <SettingsForm initial={settings} />
      </Card>
    </div>
  );
}
