import Link from "next/link";
import { PrintButton } from "@/components/print-button";

type Row = {
  subject: string;
  caScore: number | null;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  remark: string | null;
  teacherComment: string | null;
  className: string;
  sessionName: string;
  termName: string;
  publishedAt: Date | null;
};

function gradeColorClass(grade: string | null): string {
  if (!grade) return "";
  const g = grade.toUpperCase();
  if (g === "A" || g === "A+" || g === "A-") return "result-grade-a";
  if (g === "B" || g === "B+" || g === "B-") return "result-grade-b";
  if (g === "C" || g === "C+" || g === "C-") return "result-grade-c";
  if (g === "F" || g === "FAIL") return "result-grade-f";
  return "";
}

function scoreBar(total: number | null) {
  if (total == null) return null;
  const pct = Math.min(100, Math.max(0, total));
  const color =
    pct >= 70
      ? "var(--c-emerald)"
      : pct >= 50
      ? "var(--c-sky)"
      : pct >= 40
      ? "var(--c-gold)"
      : "var(--c-danger)";
  return (
    <div
      className="mt-1 h-1 w-full rounded-full overflow-hidden"
      style={{ background: "var(--c-surface-3)" }}
      aria-hidden
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function ResultSheet({
  schoolName,
  studentName,
  admissionNumber,
  results,
  backHref,
}: {
  schoolName: string;
  studentName: string;
  admissionNumber: string;
  results: Row[];
  backHref: string;
}) {
  const meta = results[0];
  const average =
    results.length && results.every((r) => r.totalScore != null)
      ? (
          results.reduce((sum, r) => sum + (r.totalScore ?? 0), 0) / results.length
        ).toFixed(1)
      : null;

  const passed = results.filter(
    (r) => r.totalScore != null && r.totalScore >= 40
  ).length;
  const failed = results.filter(
    (r) => r.totalScore != null && r.totalScore < 40
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* ── Back & Print ─────────────────────────────────────────── */}
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--c-sky)] hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to results
        </Link>
        <PrintButton />
      </div>

      {/* ── Main Sheet ───────────────────────────────────────────── */}
      <div
        className="print-sheet overflow-hidden rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-[var(--shadow-lg)]"
      >
        {/* Header bar */}
        <div
          className="relative overflow-hidden px-8 py-8 text-center"
          style={{
            background: "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)",
          }}
        >
          <div
            className="glow-orb glow-orb-blue absolute"
            style={{ width: "200px", height: "200px", top: "-50%", right: "5%", opacity: 0.2 }}
          />
          <div className="relative z-10">
            <h1 className="font-display text-2xl font-bold text-white">
              {schoolName}
            </h1>
            <p
              className="mt-1.5 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/70"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Academic Result Sheet
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Student info grid */}
          <div
            className="grid gap-4 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-border)" }}
          >
            {[
              { label: "Student name", value: studentName },
              { label: "Admission number", value: admissionNumber },
              { label: "Class", value: meta?.className ?? "—" },
              {
                label: "Session / Term",
                value: meta ? `${meta.sessionName} · ${meta.termName}` : "—",
              },
              {
                label: "Published",
                value: meta?.publishedAt
                  ? new Date(meta.publishedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—",
              },
              {
                label: "Average score",
                value: average ? `${average}%` : "—",
                highlight: true,
              },
            ].map((field) => (
              <div key={field.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--c-text-3)]">
                  {field.label}
                </dt>
                <dd
                  className={`mt-1 text-sm font-semibold ${
                    field.highlight
                      ? "font-display text-lg text-[var(--c-sky)]"
                      : "text-[var(--c-text)]"
                  }`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </div>

          {/* Summary pills */}
          {average && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: "var(--c-emerald-pale)", color: "var(--c-emerald)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {passed} passed
              </div>
              {failed > 0 && (
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ background: "var(--c-danger-pale)", color: "var(--c-danger)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {failed} failed
                </div>
              )}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: "var(--c-ice)", color: "var(--c-sky)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.72L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95z"/>
                </svg>
                Average: {average}%
              </div>
            </div>
          )}

          {/* Results table */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--c-border)]">
            <table className="table-premium">
              <thead>
                <tr>
                  <th className="text-left">Subject</th>
                  <th className="text-center">CA</th>
                  <th className="text-center">Exam</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Grade</th>
                  <th className="hidden sm:table-cell">Remark</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.subject}>
                    <td className="font-medium text-[var(--c-text)]">
                      {r.subject}
                    </td>
                    <td className="text-center text-[var(--c-text-3)]">
                      {r.caScore ?? "—"}
                    </td>
                    <td className="text-center text-[var(--c-text-3)]">
                      {r.examScore ?? "—"}
                    </td>
                    <td className="text-center">
                      <div>
                        <span className="font-semibold text-[var(--c-text)]">
                          {r.totalScore ?? "—"}
                        </span>
                        {r.totalScore != null && scoreBar(r.totalScore)}
                      </div>
                    </td>
                    <td className={`text-center font-bold ${gradeColorClass(r.grade)}`}>
                      {r.grade ?? "—"}
                    </td>
                    <td className="hidden text-sm text-[var(--c-text-3)] sm:table-cell">
                      {r.remark ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Teacher comments */}
          {results.some((r) => r.teacherComment) && (
            <div
              className="mt-8 rounded-2xl p-5"
              style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-border)" }}
            >
              <h2 className="font-display text-lg font-semibold text-[var(--c-text)]">
                Teacher comments
              </h2>
              <ul className="mt-4 space-y-3">
                {results
                  .filter((r) => r.teacherComment)
                  .map((r) => (
                    <li
                      key={r.subject}
                      className="flex gap-3 text-sm"
                    >
                      <span
                        className="mt-0.5 h-5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: "var(--c-sky)" }}
                      />
                      <span>
                        <strong className="font-semibold text-[var(--c-text)]">
                          {r.subject}:
                        </strong>{" "}
                        <span className="text-[var(--c-text-3)]">
                          {r.teacherComment}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div
            className="mt-8 border-t border-[var(--c-border)] pt-5 text-center text-xs text-[var(--c-text-3)]"
          >
            This result sheet was generated by {schoolName} via the Splendor School
            Management System. For enquiries, contact the school office.
          </div>
        </div>
      </div>
    </div>
  );
}
