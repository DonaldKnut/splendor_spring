import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "@/lib/permissions";
import { CreateSubAdminForm } from "@/components/forms";
import { Card, PageHeader } from "@/components/ui";

export default async function AdministratorsPage() {
  await requireRole("HEAD_ADMIN");
  const admins = await db.user.findMany({
    include: { permissions: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Administrators"
        description="Invite sub-admins and choose exactly which control-room tools they can use."
      />
      <Card className="mb-6">
        <CreateSubAdminForm
          permissions={ALL_PERMISSIONS.map((p) => ({
            id: p,
            label: PERMISSION_LABELS[p],
          }))}
        />
      </Card>
      <div className="space-y-3">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <h2 className="font-display text-lg">{admin.name}</h2>
            <p className="text-sm text-ink/65">
              {admin.email} · {admin.role} · {admin.status}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
