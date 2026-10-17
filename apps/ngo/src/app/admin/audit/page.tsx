import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { EmptyState, PageHeader } from "@/components/ui";

export default async function AuditPage() {
  await requirePermission("view_audit");
  const logs = await db.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Audit logs" />
      {logs.length ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-sand/50">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Entity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-line/70">
                  <td className="px-3 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">{log.actor?.name ?? "System"}</td>
                  <td className="px-3 py-2">{log.action}</td>
                  <td className="px-3 py-2">{log.entityType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No audit events yet" />
      )}
    </div>
  );
}
