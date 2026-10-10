import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import {
  AdminShell,
  AdminPanel,
  AdminTable,
  AdminEmpty,
  AdminSearch,
  Pagination,
} from "@/components/admin-chrome";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("view_audit");
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = 40;
  const where = q
    ? {
        OR: [
          { action: { contains: q, mode: "insensitive" as const } },
          { entityType: { contains: q, mode: "insensitive" as const } },
          { actor: { name: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [total, logs] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { actor: true },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / take));

  return (
    <AdminShell
      title="Audit logs"
      description="Sensitive administrative actions across the school portal."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.72L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05z" />
        </svg>
      }
    >
      <AdminPanel
        title="Activity"
        description={`${total} events`}
        actions={<AdminSearch defaultValue={q} placeholder="Action, actor, entity" />}
      >
        {logs.length ? (
          <div className="space-y-4">
            <AdminTable headers={["When", "Actor", "Action", "Entity"]}>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-[var(--c-text-3)]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.actor?.name ?? "System"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3 text-sm">
                    {log.entityType}
                    {log.entityId ? (
                      <span className="text-[var(--c-text-3)]"> · {log.entityId.slice(0, 8)}…</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </AdminTable>
            <Pagination
              page={page}
              pages={pages}
              total={total}
              baseHref={`/admin/audit?q=${encodeURIComponent(q)}`}
            />
          </div>
        ) : (
          <AdminEmpty title="No audit events yet" />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
