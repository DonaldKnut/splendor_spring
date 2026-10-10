import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";

export default async function StudentPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: { class: true },
  });
  if (!student) redirect("/login");

  const sessions = await db.academicSession.findMany({
    where: {
      results: {
        some: {
          studentId: student.id,
          status: { in: ["PUBLISHED", "CORRECTED"] },
        },
      },
    },
    include: {
      terms: {
        where: {
          results: {
            some: {
              studentId: student.id,
              status: { in: ["PUBLISHED", "CORRECTED"] },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--c-surface-2)" }}
    >
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 border-b border-[var(--c-border)] bg-white/90 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))" }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)]">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-xs text-[var(--c-text-3)]">
                {student.admissionNumber}
                {student.class ? ` · ${student.class.name}` : ""}
              </p>
            </div>
          </div>
          <div className="no-print">
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Hero card */}
        <div
          className="mb-10 relative overflow-hidden rounded-3xl px-8 py-10"
          style={{
            background: "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)",
          }}
        >
          <div
            className="glow-orb glow-orb-blue absolute"
            style={{ width: "250px", height: "250px", top: "-30%", right: "0", opacity: 0.2 }}
          />
          <div className="relative z-10 flex items-center gap-5">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))" }}
            >
              {initials}
            </div>
            <div>
              <p className="hero-eyebrow mb-1">Student Portal</p>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                {student.firstName} {student.lastName}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white/80"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  {student.admissionNumber}
                </span>
                {student.class && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white/80"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {student.class.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="mb-6">
          <p className="section-label">Academic records</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
            My results
          </h2>
          <div className="section-divider" />
        </div>

        {/* Sessions */}
        {sessions.length ? (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-md)]"
              >
                {/* Session header */}
                <div
                  className="flex items-center gap-3 border-b border-[var(--c-border)] px-6 py-4"
                  style={{ background: "var(--c-surface-2)" }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: "var(--c-ice)", color: "var(--c-sky)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                  </div>
                  <h2 className="font-display text-base font-semibold text-[var(--c-text)]">
                    {s.name}
                  </h2>
                </div>

                {/* Terms */}
                <ul className="divide-y divide-[var(--c-border)]">
                  {s.terms.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/portal/student/results?sessionId=${s.id}&termId=${t.id}`}
                        className="group flex items-center justify-between px-6 py-4 transition-all duration-150 hover:bg-[var(--c-surface-2)]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ background: "linear-gradient(135deg, var(--c-emerald), #047857)" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-[var(--c-text)]">
                            {t.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--c-sky)] opacity-0 transition-opacity group-hover:opacity-100">
                          View results
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published results yet"
            description="Results will appear here after the school publishes them."
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}
