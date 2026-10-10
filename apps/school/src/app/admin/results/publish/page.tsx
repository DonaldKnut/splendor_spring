import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { AdminShell, AdminPanel } from "@/components/admin-chrome";
import { PublishResultsForm } from "@/components/forms/result-forms";

export default async function PublishResultsPage() {
  await requirePermission("publish_results");
  const [sessions, classes, subjects, draftCount, publishedCount] = await Promise.all([
    db.academicSession.findMany({
      include: { terms: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    db.schoolClass.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    db.result.count({ where: { status: "DRAFT" } }),
    db.result.count({ where: { status: { in: ["PUBLISHED", "CORRECTED"] } } }),
  ]);

  return (
    <AdminShell
      title="Publish results"
      description="Release draft scores to student and parent portals. This cannot be silently undone."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--c-border)] bg-white px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
            Drafts awaiting publish
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-[var(--c-text)]">{draftCount}</p>
        </div>
        <div className="rounded-2xl border border-[var(--c-border)] bg-white px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
            Live published / corrected
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-[var(--c-text)]">
            {publishedCount}
          </p>
        </div>
      </div>

      <AdminPanel
        title="Publish by class & subject"
        description="Select session, term, class, and subject, then publish matching drafts."
      >
        <PublishResultsForm
          sessions={sessions.map((s) => ({
            id: s.id,
            name: s.name,
            terms: s.terms.map((t) => ({ id: t.id, name: t.name })),
          }))}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
        />
      </AdminPanel>
    </AdminShell>
  );
}
