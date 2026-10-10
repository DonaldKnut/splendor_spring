import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboardCards } from "@/components/admin-dashboard-cards";
import { DashboardGuideBar } from "@/components/admin-guide/dashboard-guide-bar";
import { HelpTooltip } from "@/components/admin-guide";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const [
    studentCount,
    parentCount,
    teacherCount,
    classCount,
    draftResults,
    publishedResults,
    newContacts,
    currentSession,
    recentAudit,
  ] = await Promise.all([
    db.student.count({ where: { status: "ACTIVE" } }),
    db.parentProfile.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { role: "TEACHER", status: "ACTIVE" } }),
    db.schoolClass.count({ where: { isActive: true } }),
    db.result.count({ where: { status: "DRAFT" } }),
    db.result.count({ where: { status: { in: ["PUBLISHED", "CORRECTED"] } } }),
    db.contactSubmission.count({ where: { status: "NEW" } }),
    db.academicSession.findFirst({ where: { isCurrent: true } }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { actor: true },
    }),
  ]);

  const isHeadAdmin = session?.user?.role === "HEAD_ADMIN";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5 min-[360px]:space-y-6 sm:space-y-8">
      <div data-tour="tour-welcome">
        <div
          className="relative overflow-hidden rounded-2xl px-3.5 py-5 min-[360px]:rounded-3xl min-[360px]:px-5 min-[360px]:py-7 sm:px-8 sm:py-10"
          style={{
            background:
              "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)",
          }}
        >
          <div className="relative z-10 flex flex-col gap-3 min-[360px]:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/40 min-[360px]:text-xs min-[360px]:tracking-[0.2em]">
                {greeting}
              </p>
              <h1 className="mt-1 truncate font-display text-xl font-bold text-white min-[360px]:text-2xl sm:text-3xl">
                {session?.user.name}
              </h1>
              <p className="mt-1 text-xs text-white/55 min-[360px]:text-sm">
                {currentSession
                  ? `Current session: ${currentSession.name}`
                  : "No active academic session configured"}
              </p>
              <div className="mt-3">
                <DashboardGuideBar />
              </div>
            </div>

            {(draftResults > 0 || newContacts > 0) && (
              <div
                className="inline-flex max-w-full flex-col gap-1 rounded-xl px-3 py-3 min-[360px]:gap-1.5 min-[360px]:rounded-2xl min-[360px]:px-5 min-[360px]:py-4"
                style={{
                  background: "rgba(185,28,44,0.12)",
                  border: "1px solid rgba(185,28,44,0.25)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-amber-300 min-[360px]:text-xs">
                    Pending tasks
                  </p>
                  <HelpTooltip
                    title="Pending tasks"
                    label="Things that still need action — like draft results to publish or new website messages to read."
                    tone="gold"
                  />
                </div>
                {draftResults > 0 && (
                  <p className="text-xs text-white/75 min-[360px]:text-sm">
                    {draftResults} draft result{draftResults !== 1 ? "s" : ""} to publish
                  </p>
                )}
                {newContacts > 0 && (
                  <p className="text-xs text-white/75 min-[360px]:text-sm">
                    {newContacts} new contact message{newContacts !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminDashboardCards
        studentCount={studentCount}
        parentCount={parentCount}
        teacherCount={teacherCount}
        classCount={classCount}
        draftResults={draftResults}
        publishedResults={publishedResults}
        newContacts={newContacts}
        isHeadAdmin={!!isHeadAdmin}
      />

      <div className="grid gap-4 min-[360px]:gap-6 lg:grid-cols-2">
        <div data-tour="tour-session">
        <Card>
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl min-[360px]:h-11 min-[360px]:w-11"
              style={{
                background: "color-mix(in srgb, var(--c-sky) 14%, white)",
                color: "var(--c-sky)",
                boxShadow: "0 8px 18px color-mix(in srgb, var(--c-sky) 16%, transparent)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-semibold text-[var(--c-text)] min-[360px]:text-lg">
                  Academic session
                </h2>
                <HelpTooltip
                  title="Academic session"
                  label="This is the current school year (for example 2026/2027). Results and classes belong to this session."
                />
              </div>
              {currentSession ? (
                <>
                  <p className="mt-1.5 text-xs text-[var(--c-text-3)] min-[360px]:text-sm">
                    Current session:
                  </p>
                  <p className="mt-0.5 font-semibold text-[var(--c-text)]">{currentSession.name}</p>
                </>
              ) : (
                <p className="mt-1.5 text-xs text-[var(--c-text-3)] min-[360px]:text-sm">
                  No current session set. Configure one under Sessions &amp; Terms.
                </p>
              )}
            </div>
          </div>

          <div
            className="mt-4 rounded-xl px-3 py-3 min-[360px]:mt-5 min-[360px]:px-4 min-[360px]:py-3.5"
            style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-border)" }}
          >
            <p className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--c-text-3)] min-[360px]:text-xs">
              Pending tasks
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-[var(--c-text-2)]">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      background: draftResults > 0
                        ? "color-mix(in srgb, var(--c-danger) 12%, white)"
                        : "color-mix(in srgb, var(--c-sky) 10%, white)",
                      color: draftResults > 0 ? "var(--c-danger)" : "var(--c-sky)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </span>
                  Draft results
                </span>
                <span className={`badge ${draftResults > 0 ? "badge-red" : "badge-green"}`}>
                  {draftResults}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-[var(--c-text-2)]">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      background: newContacts > 0
                        ? "color-mix(in srgb, var(--c-gold) 14%, white)"
                        : "color-mix(in srgb, var(--c-sky) 10%, white)",
                      color: newContacts > 0 ? "var(--c-gold)" : "var(--c-sky)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </span>
                  New contact messages
                </span>
                <span className={`badge ${newContacts > 0 ? "badge-gold" : "badge-green"}`}>
                  {newContacts}
                </span>
              </div>
            </div>
          </div>
        </Card>
        </div>

        <div data-tour="tour-activity">
        <Card>
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl min-[360px]:h-11 min-[360px]:w-11"
              style={{
                background: "color-mix(in srgb, var(--c-emerald) 14%, white)",
                color: "var(--c-emerald)",
                boxShadow: "0 8px 18px color-mix(in srgb, var(--c-emerald) 16%, transparent)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold text-[var(--c-text)] min-[360px]:text-lg">
                Recent activity
              </h2>
              <HelpTooltip
                title="Recent activity"
                label="A short list of important actions in the system — who did what, and when."
                tone="emerald"
              />
            </div>
          </div>

          {recentAudit.length ? (
            <ul className="mt-4 space-y-0 divide-y divide-[var(--c-border)] min-[360px]:mt-5">
              {recentAudit.map((log) => (
                <li key={log.id} className="flex items-start gap-3 py-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "color-mix(in srgb, var(--c-sky) 12%, white)",
                      color: "var(--c-sky)",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--c-text)]">{log.action}</p>
                    <p className="mt-0.5 text-xs text-[var(--c-text-3)]">
                      {log.actor?.name ?? "System"} ·{" "}
                      {new Date(log.createdAt).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-center text-sm text-[var(--c-text-3)] min-[360px]:mt-5">
              No audit events yet.
            </p>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}
