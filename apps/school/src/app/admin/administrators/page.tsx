import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  TEACHER_DEFAULT_PERMISSIONS,
} from "@/lib/permissions";
import { Badge } from "@/components/ui";
import { AdminShell, AdminPanel } from "@/components/admin-chrome";
import {
  CreateSubAdminForm,
  CreateTeacherForm,
  StaffCredentialActions,
  StaffPermissionsForm,
} from "@/components/forms/admin-forms";

export default async function AdministratorsPage() {
  await requireRole("HEAD_ADMIN");
  const staff = await db.user.findMany({
    where: { role: { in: ["HEAD_ADMIN", "SUB_ADMIN", "TEACHER"] } },
    include: { permissions: true },
    orderBy: { createdAt: "asc" },
  });

  const allPerms = ALL_PERMISSIONS.map((p) => ({
    id: p,
    label: PERMISSION_LABELS[p],
  }));
  const teacherPerms = TEACHER_DEFAULT_PERMISSIONS.map((p) => ({
    id: p,
    label: PERMISSION_LABELS[p],
  }));

  return (
    <AdminShell
      title="Staff & administrators"
      description="Issue Sub-Admin and Teacher accounts with least-privilege permissions."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
        </svg>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Create Sub-Admin" description="Full configurable permission set.">
          <CreateSubAdminForm permissions={allPerms} />
        </AdminPanel>
        <AdminPanel
          title="Create Teacher"
          description="Defaults to students + unpublished results only."
        >
          <CreateTeacherForm defaultPermissions={teacherPerms} />
        </AdminPanel>
      </div>

      <div className="space-y-4">
        {staff.map((member) => (
          <AdminPanel
            key={member.id}
            title={member.name}
            description={`${member.email} · ${member.role}`}
            actions={
              <Badge tone={member.status === "ACTIVE" ? "green" : "red"}>
                {member.status}
              </Badge>
            }
          >
            {member.role === "HEAD_ADMIN" ? (
              <p className="text-sm text-[var(--c-text-3)]">Full access · bootstrap account</p>
            ) : (
              <>
                <p className="text-sm text-[var(--c-text-3)]">
                  Current:{" "}
                  {member.permissions.length
                    ? member.permissions.map((p) => p.permission).join(", ")
                    : "None"}
                </p>
                <StaffCredentialActions
                  userId={member.id}
                  role={member.role}
                  status={member.status}
                />
                <StaffPermissionsForm
                  userId={member.id}
                  role={member.role}
                  permissions={member.role === "TEACHER" ? teacherPerms : allPerms}
                  selected={member.permissions.map((p) => p.permission)}
                />
              </>
            )}
          </AdminPanel>
        ))}
      </div>
    </AdminShell>
  );
}
