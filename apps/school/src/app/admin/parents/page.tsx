import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import {
  AdminShell,
  AdminPanel,
  AdminTable,
  StatusPill,
} from "@/components/admin-chrome";
import { ParentsRegistryActions } from "@/components/parents-registry-actions";
import { ParentRowActions } from "@/components/forms/parent-actions";

export default async function ParentsAdminPage() {
  await requirePermission("manage_parents");
  const [parents, students] = await Promise.all([
    db.parentProfile.findMany({
      include: {
        user: true,
        children: { include: { student: true } },
      },
      orderBy: { user: { name: "asc" } },
    }),
    db.student.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
  ]);

  const studentOptions = students.map((s) => ({
    id: s.id,
    label: `${s.lastName}, ${s.firstName} (${s.admissionNumber})`,
  }));

  return (
    <AdminShell
      title="Parents & guardians"
      description="Issue parent portal accounts and link them to students."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      }
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-[var(--c-border)] p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        }}
      >
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--c-emerald)]/20 bg-[var(--c-emerald-pale)] px-3 py-1 text-xs font-semibold text-[var(--c-emerald)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-emerald)]" />
            Family access
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--c-text)] sm:text-3xl">
            Manage parent portal accounts
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-3)]">
            Create guardian logins, link pupils for gradebook access, and keep family contacts in
            one place.
          </p>
          <div className="mt-5">
            <ParentsRegistryActions students={studentOptions} />
          </div>
        </div>
      </div>

      <AdminPanel
        title="Directory"
        description={`${parents.length} parent account${parents.length === 1 ? "" : "s"}`}
        actions={<ParentsRegistryActions students={studentOptions} variant="panel" />}
      >
        {parents.length ? (
          <AdminTable headers={["Name", "Email", "Phone", "Students", "Status", ""]}>
            {parents.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-[var(--c-text)]">{p.user.name}</td>
                <td className="px-4 py-3 text-[var(--c-text-3)]">{p.user.email}</td>
                <td className="px-4 py-3">{p.phone ?? "—"}</td>
                <td className="px-4 py-3 text-sm">
                  {p.children.length
                    ? p.children
                        .map((c) => `${c.student.firstName} ${c.student.lastName}`)
                        .join(", ")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill active={p.status === "ACTIVE"} label={p.status} />
                </td>
                <td className="px-4 py-3">
                  <ParentRowActions userId={p.userId} status={p.user.status} />
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <h3 className="font-display text-lg font-bold text-[var(--c-text)]">No parents yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-[var(--c-text-3)]">
              Create a parent account to start linking families.
            </p>
            <ParentsRegistryActions students={studentOptions} variant="empty" />
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
