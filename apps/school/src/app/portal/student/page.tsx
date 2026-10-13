import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { PortalShell } from "@/components/portal-shell";
import { PortalTourLaunchButton } from "@/components/portal-guide";

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
  const termCount = sessions.reduce((n, s) => n + s.terms.length, 0);

  return (
    <PortalShell
      role="STUDENT"
      title={`${student.firstName} ${student.lastName}`}
      subtitle={`${student.admissionNumber}${student.class ? ` · ${student.class.name}` : ""}`}
    >
      <div
        data-tour="portal-welcome"
        className="relative mb-10 overflow-hidden rounded-3xl px-6 py-9 sm:px-8 sm:py-10"
        style={{
          background:
            "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-56 w-56 rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, var(--c-sky) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))" }}
            >
              {initials}
            </div>
            <div>
              <p className="hero-eyebrow mb-1">Student portal</p>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                Hello, {student.firstName}
              </h1>
              <p className="mt-1.5 max-w-md text-sm text-white/65">
                View and print published results only. Nothing appears here until the school
                releases a term.
              </p>
            </div>
          </div>
          <PortalTourLaunchButton variant="banner" />
        </div>
      </div>

      <div data-tour="portal-results">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Academic records</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
              My results
            </h2>
            <div className="section-divider" />
          </div>
          {termCount > 0 ? (
            <p className="text-sm text-[var(--c-text-3)]">
              {termCount} published term{termCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        {sessions.length ? (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-md)]"
              >
                <div
                  className="flex items-center gap-3 border-b border-[var(--c-border)] px-5 py-4 sm:px-6"
                  style={{ background: "var(--c-surface-2)" }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: "var(--c-ice)", color: "var(--c-sky)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-base font-semibold text-[var(--c-text)]">
                    {s.name}
                  </h3>
                </div>

                <ul className="divide-y divide-[var(--c-border)]">
                  {s.terms.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/portal/student/results?sessionId=${s.id}&termId=${t.id}`}
                        className="group flex items-center justify-between px-5 py-4 transition-all duration-150 hover:bg-[var(--c-surface-2)] sm:px-6"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                            style={{
                              background: "linear-gradient(135deg, var(--c-emerald), #047857)",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-[var(--c-text)]">{t.name}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--c-sky)] opacity-70 transition-opacity group-hover:opacity-100">
                          View &amp; print
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                          </svg>
                        </span>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
              </svg>
            }
          />
        )}
      </div>
    </PortalShell>
  );
}
