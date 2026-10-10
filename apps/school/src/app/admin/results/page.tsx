import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { guardPage } from "@/lib/guard";
import { getScoreLimits } from "@/lib/grades";
import { AdminShell, AdminPanel } from "@/components/admin-chrome";
import { ResultEntryForm } from "@/components/forms/result-forms";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sessionId?: string;
    termId?: string;
    classId?: string;
    subjectId?: string;
  }>;
}) {
  await guardPage(() => requirePermission("enter_results"));
  const sp = await searchParams;
  const [sessions, classes, subjects, limits] = await Promise.all([
    db.academicSession.findMany({
      include: { terms: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    db.schoolClass.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    getScoreLimits(),
  ]);

  const sessionId = sp.sessionId || sessions.find((s) => s.isCurrent)?.id || sessions[0]?.id;
  const session = sessions.find((s) => s.id === sessionId);
  const termId = sp.termId || session?.terms.find((t) => t.isCurrent)?.id || session?.terms[0]?.id;
  const classId = sp.classId || classes[0]?.id;
  const subjectId = sp.subjectId || subjects[0]?.id;

  const students =
    classId && sessionId
      ? await db.student.findMany({
          where: {
            enrollments: {
              some: { classId, sessionId, status: "ACTIVE" },
            },
          },
          orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
          include: {
            results: {
              where: { termId: termId ?? "", subjectId: subjectId ?? "" },
            },
          },
        })
      : [];

  const draftCount = students.filter((s) => s.results[0]?.status === "DRAFT").length;
  const publishedCount = students.filter((s) =>
    ["PUBLISHED", "CORRECTED"].includes(s.results[0]?.status ?? "")
  ).length;

  return (
    <AdminShell
      title="Result entry"
      description={`CA max ${limits.caMax} · Exam max ${limits.examMax}. Drafts stay private until published.`}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--c-border)] bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
            Roster
          </p>
          <p className="mt-1 font-display text-2xl font-bold">{students.length}</p>
        </div>
        <div className="rounded-2xl border border-[var(--c-border)] bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
            Drafts in view
          </p>
          <p className="mt-1 font-display text-2xl font-bold">{draftCount}</p>
        </div>
        <div className="rounded-2xl border border-[var(--c-border)] bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
            Published in view
          </p>
          <p className="mt-1 font-display text-2xl font-bold">{publishedCount}</p>
        </div>
      </div>

      <AdminPanel
        title="Gradebook"
        description={
          students.length
            ? "Enter CA and exam scores, then save drafts."
            : "No enrolled students for this class/session — enroll students first."
        }
      >
        <ResultEntryForm
          sessions={sessions.map((s) => ({
            id: s.id,
            name: s.name,
            terms: s.terms.map((t) => ({ id: t.id, name: t.name })),
          }))}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
          selected={{
            sessionId: sessionId ?? "",
            termId: termId ?? "",
            classId: classId ?? "",
            subjectId: subjectId ?? "",
          }}
          students={students.map((s) => ({
            id: s.id,
            label: `${s.lastName}, ${s.firstName}`,
            caScore: s.results[0]?.caScore ?? null,
            examScore: s.results[0]?.examScore ?? null,
            status: s.results[0]?.status ?? null,
            teacherComment: s.results[0]?.teacherComment ?? "",
          }))}
          limits={limits}
        />
      </AdminPanel>
    </AdminShell>
  );
}
