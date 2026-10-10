import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
  StatusPill,
} from "@/components/admin-chrome";
import { ClassForm, ClassSubjectActions } from "@/components/forms/academic-forms";

export default async function ClassesPage() {
  await requirePermission("manage_classes");
  const [classes, subjects] = await Promise.all([
    db.schoolClass.findMany({
      include: {
        subjects: { include: { subject: true } },
        _count: { select: { students: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  const subjectOpts = subjects.map((s) => ({ id: s.id, name: s.name }));

  return (
    <AdminShell
      title="Classes"
      description="Define grades, assign subjects, and track class strength."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      }
    >
      <AdminPanel title="Create class" description="New classes appear in student enrollment and results.">
        <ClassForm subjects={subjectOpts} />
      </AdminPanel>

      {classes.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {classes.map((c) => (
            <AdminPanel
              key={c.id}
              title={c.name}
              description={`${c.code}${c.level ? ` · ${c.level}` : ""} · ${c._count.students} students`}
              actions={<StatusPill active={c.isActive} />}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {c.subjects.length ? (
                  c.subjects.map((s) => (
                    <ClassSubjectActions
                      key={s.subjectId}
                      classId={c.id}
                      subjectId={s.subjectId}
                      subjectName={s.subject.name}
                    />
                  ))
                ) : (
                  <p className="text-sm text-[var(--c-text-3)]">No subjects assigned yet.</p>
                )}
              </div>
              <details className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--c-text)]">
                  Edit class
                </summary>
                <div className="mt-4">
                  <ClassForm
                    subjects={subjectOpts}
                    initial={{
                      id: c.id,
                      name: c.name,
                      code: c.code,
                      level: c.level,
                      description: c.description,
                      sortOrder: c.sortOrder,
                      isActive: c.isActive,
                    }}
                  />
                </div>
              </details>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmpty title="No classes yet" description="Create the first class above." />
      )}
    </AdminShell>
  );
}
