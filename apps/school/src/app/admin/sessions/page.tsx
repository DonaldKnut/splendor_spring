import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
  StatusPill,
} from "@/components/admin-chrome";
import { SessionForm, TermActions } from "@/components/forms/academic-forms";

export default async function SessionsPage() {
  await requirePermission("manage_sessions");
  const sessions = await db.academicSession.findMany({
    include: { terms: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell
      title="Sessions & terms"
      description="Mark the current academic year and term used for enrollments and results."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
      }
    >
      <AdminPanel
        title="Create academic session"
        description="Automatically creates First, Second, and Third terms."
      >
        <SessionForm />
      </AdminPanel>

      {sessions.length ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <AdminPanel
              key={session.id}
              title={session.name}
              description={
                [
                  session.startDate
                    ? `Starts ${session.startDate.toLocaleDateString()}`
                    : null,
                  session.endDate ? `Ends ${session.endDate.toLocaleDateString()}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No dates set"
              }
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  {session.isCurrent ? <Badge tone="gold">Current</Badge> : null}
                  <StatusPill active={session.isActive} />
                  <TermActions sessionId={session.id} isCurrent={session.isCurrent} />
                </div>
              }
            >
              <ul className="space-y-2">
                {session.terms.map((term) => (
                  <li
                    key={term.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--c-border)] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--c-text)]">{term.name}</span>
                      {term.isCurrent ? <Badge tone="navy">Current term</Badge> : null}
                    </div>
                    <TermActions termId={term.id} isCurrent={term.isCurrent} />
                  </li>
                ))}
              </ul>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmpty
          title="No sessions yet"
          description="Create an academic session to begin enrollments and results."
        />
      )}
    </AdminShell>
  );
}