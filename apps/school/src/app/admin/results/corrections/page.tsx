import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { guardPage } from "@/lib/guard";
import { getScoreLimits } from "@/lib/grades";
import { Badge } from "@/components/ui";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
  AdminSearch,
} from "@/components/admin-chrome";
import { ResultCorrectionForm } from "@/components/forms/result-correction";

export default async function ResultCorrectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await guardPage(() => requirePermission("publish_results"));
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const [results, limits] = await Promise.all([
    db.result.findMany({
      where: {
        status: { in: ["PUBLISHED", "CORRECTED"] },
        ...(q
          ? {
              OR: [
                { student: { firstName: { contains: q, mode: "insensitive" } } },
                { student: { lastName: { contains: q, mode: "insensitive" } } },
                { subject: { name: { contains: q, mode: "insensitive" } } },
                { class: { name: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        student: true,
        subject: true,
        class: true,
        term: true,
        session: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    getScoreLimits(),
  ]);

  return (
    <AdminShell
      title="Result corrections"
      description="Published scores cannot be silently edited — every change is audited."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      }
    >
      <AdminPanel
        title="Published results"
        description="Latest 50 matching records"
        actions={<AdminSearch defaultValue={q} placeholder="Student, subject, class" />}
      >
        {results.length ? (
          <div className="space-y-4">
            {results.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--c-text)]">
                      {r.student.lastName}, {r.student.firstName} · {r.subject.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--c-text-3)]">
                      {r.session.name} · {r.term.name} · {r.class.name} · CA {r.caScore} · Exam{" "}
                      {r.examScore} · Total {r.totalScore} · Grade {r.grade ?? "—"}
                    </p>
                  </div>
                  <Badge tone={r.status === "CORRECTED" ? "gold" : "green"}>{r.status}</Badge>
                </div>
                <ResultCorrectionForm
                  resultId={r.id}
                  caScore={r.caScore}
                  examScore={r.examScore}
                  teacherComment={r.teacherComment}
                  caMax={limits.caMax}
                  examMax={limits.examMax}
                />
              </div>
            ))}
          </div>
        ) : (
          <AdminEmpty
            title="No published results"
            description="Publish drafts first, then corrections appear here."
          />
        )}
      </AdminPanel>
    </AdminShell>
  );
}
