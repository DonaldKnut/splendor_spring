import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { PortalShell } from "@/components/portal-shell";
import { PortalTourLaunchButton } from "@/components/portal-guide";

export default async function ParentPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PARENT") redirect("/login");

  const parent = await db.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      children: {
        include: {
          student: { include: { class: true } },
        },
      },
    },
  });
  if (!parent) redirect("/login");

  const firstName = session.user.name?.split(" ")[0] ?? "Parent";

  return (
    <PortalShell
      role="PARENT"
      title={session.user.name || "Parent portal"}
      subtitle="Published results for linked children only"
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
          className="pointer-events-none absolute -right-10 top-0 h-52 w-52 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--c-tan) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hero-eyebrow mb-1">Parent portal</p>
            <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
              Welcome, {firstName}
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-white/65">
              Open a child to see published term results and print report sheets. Drafts stay
              private until the school releases them.
            </p>
          </div>
          <PortalTourLaunchButton variant="banner" />
        </div>
      </div>

      <div data-tour="portal-children">
        <div className="mb-6">
          <p className="section-label">Family</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)]">
            Your children
          </h2>
          <div className="section-divider" />
        </div>

        {parent.children.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {parent.children.map((link) => {
              const s = link.student;
              const initials =
                `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`.toUpperCase();
              return (
                <Link
                  key={link.id}
                  href={`/portal/parent/${s.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold text-[var(--c-text)]">
                        {s.firstName} {s.lastName}
                      </h3>
                      <p className="mt-0.5 text-sm text-[var(--c-text-3)]">
                        {s.admissionNumber}
                        {s.class ? ` · ${s.class.name}` : ""}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--c-sky)]">
                        View results
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No linked students"
            description="Ask the school office to link your children to this account."
          />
        )}
      </div>
    </PortalShell>
  );
}
