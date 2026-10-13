import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PortalShell } from "@/components/portal-shell";
import { PortalTourLaunchButton } from "@/components/portal-guide";

export default async function TeacherPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "TEACHER") redirect("/login");

  const [studentCount, draftResults, publishedResults, currentSession] = await Promise.all([
    db.student.count({ where: { status: "ACTIVE" } }),
    db.result.count({ where: { status: "DRAFT" } }),
    db.result.count({ where: { status: { in: ["PUBLISHED", "CORRECTED"] } } }),
    db.academicSession.findFirst({ where: { isCurrent: true } }),
  ]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = session.user.name?.split(" ")[0] ?? "Teacher";

  const tasks = [
    {
      href: "/admin/results",
      title: "Enter results",
      body: "Add or edit draft scores for your classes. Drafts stay private until published.",
      accent: "var(--c-sky)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      ),
    },
    {
      href: "/admin/students",
      title: "View students",
      body: "Look up pupil details, classes, and admission numbers when you need them.",
      accent: "var(--c-emerald)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const counts = [
    { label: "Active pupils", value: studentCount, tone: "var(--c-sky)" },
    { label: "Draft results", value: draftResults, tone: draftResults > 0 ? "var(--c-danger)" : "var(--c-emerald)" },
    { label: "Published", value: publishedResults, tone: "var(--c-emerald)" },
  ];

  return (
    <PortalShell
      role="TEACHER"
      title={session.user.name || "Teacher desk"}
      subtitle={currentSession ? `Session · ${currentSession.name}` : "No active session set"}
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
          className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--c-gold) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/40">
              {greeting}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              {firstName}, your teaching desk
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-white/65">
              Focused tools for students and results — without the full admin console.
            </p>
          </div>
          <PortalTourLaunchButton variant="banner" />
        </div>
      </div>

      <div data-tour="portal-tasks" className="mb-10">
        <div className="mb-6">
          <p className="section-label">Your work</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
            What to do next
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tasks.map((task) => (
            <Link
              key={task.href}
              href={task.href}
              className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in srgb, ${task.accent} 14%, white)`,
                  color: task.accent,
                }}
              >
                {task.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--c-text)]">
                {task.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--c-text-3)]">{task.body}</p>
              <span
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                style={{ color: task.accent }}
              >
                Open
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div data-tour="portal-counts">
        <div className="mb-6">
          <p className="section-label">At a glance</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
            School snapshot
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {counts.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] px-5 py-5 shadow-[var(--shadow-xs)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-text-3)]">
                {c.label}
              </p>
              <p
                className="mt-2 font-display text-3xl font-bold tabular-nums"
                style={{ color: c.tone }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {draftResults > 0 ? (
          <p className="mt-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-gold-pale)] px-4 py-3 text-sm text-[var(--c-text-2)]">
            You have {draftResults} draft result{draftResults === 1 ? "" : "s"} waiting. Open{" "}
            <Link href="/admin/results" className="font-semibold text-[var(--c-sky)] underline">
              Results
            </Link>{" "}
            to continue — publishing may require extra permission.
          </p>
        ) : null}
      </div>
    </PortalShell>
  );
}
