import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { PortalShell } from "@/components/portal-shell";

export default async function ParentChildPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PARENT") redirect("/login");
  const { studentId } = await params;

  const parent = await db.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: { children: true },
  });
  if (!parent?.children.some((c) => c.studentId === studentId)) {
    notFound();
  }

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: { class: true },
  });
  if (!student) notFound();

  const sessions = await db.academicSession.findMany({
    where: {
      results: {
        some: {
          studentId,
          status: { in: ["PUBLISHED", "CORRECTED"] },
        },
      },
    },
    include: {
      terms: {
        where: {
          results: {
            some: {
              studentId,
              status: { in: ["PUBLISHED", "CORRECTED"] },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PortalShell
      role="PARENT"
      title={`${student.firstName} ${student.lastName}`}
      subtitle={`${student.admissionNumber}${student.class ? ` · ${student.class.name}` : ""}`}
    >
      <div className="mb-6">
        <Link
          href="/portal/parent"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--c-sky)] transition hover:opacity-80"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          All children
        </Link>
      </div>

      <div className="mb-6">
        <p className="section-label">Academic records</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
          Published results
        </h2>
        <div className="section-divider" />
      </div>

      {sessions.length ? (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-[var(--shadow-xs)]"
            >
              <div
                className="border-b border-[var(--c-border)] px-5 py-4 sm:px-6"
                style={{ background: "var(--c-surface-2)" }}
              >
                <h3 className="font-display text-base font-semibold text-[var(--c-text)]">
                  {s.name}
                </h3>
              </div>
              <ul className="divide-y divide-[var(--c-border)]">
                {s.terms.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/portal/parent/${studentId}/results?sessionId=${s.id}&termId=${t.id}`}
                      className="group flex items-center justify-between px-5 py-4 transition hover:bg-[var(--c-surface-2)] sm:px-6"
                    >
                      <span className="text-sm font-medium text-[var(--c-text)]">{t.name}</span>
                      <span className="text-xs font-semibold text-[var(--c-sky)] opacity-70 group-hover:opacity-100">
                        View &amp; print
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No published results for this student yet" />
      )}
    </PortalShell>
  );
}
