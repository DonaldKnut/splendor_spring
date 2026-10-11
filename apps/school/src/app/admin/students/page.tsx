import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { guardPage } from "@/lib/guard";
import {
  AdminShell,
  AdminPanel,
  AdminTable,
  AdminSearch,
  Pagination,
  StatusPill,
} from "@/components/admin-chrome";
import { StudentsRegistryActions } from "@/components/students-registry-actions";
import {
  StudentsHeroIllustration,
  EmptyStudentsIllustration,
} from "@/components/illustrations";

export const metadata = {
  title: "Students Management | Splendor Admin",
};

export default async function StudentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; classId?: string }>;
}) {
  await guardPage(() => requirePermission("view_students"));
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const classId = sp.classId?.trim() ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const take = 20;

  const where = {
    ...(classId ? { classId } : {}),
    ...(q
      ? {
          OR: [
            { admissionNumber: { contains: q, mode: "insensitive" as const } },
            { firstName: { contains: q, mode: "insensitive" as const } },
            { lastName: { contains: q, mode: "insensitive" as const } },
            { otherNames: { contains: q, mode: "insensitive" as const } },
            { user: { email: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [
    totalFiltered,
    students,
    classes,
    parents,
    activeStudentsCount,
    activeParentsCount,
    activeClassesCount,
    draftResultsCount,
    publishedResultsCount,
    totalTeachersCount,
  ] = await Promise.all([
    db.student.count({ where }),
    db.student.findMany({
      where,
      include: {
        class: true,
        user: true,
        parentLinks: {
          include: {
            parent: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip: (page - 1) * take,
      take,
    }),
    db.schoolClass.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.parentProfile.findMany({
      where: { status: "ACTIVE" },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    db.student.count({ where: { status: "ACTIVE" } }),
    db.parentProfile.count({ where: { status: "ACTIVE" } }),
    db.schoolClass.count({ where: { isActive: true } }),
    db.result.count({ where: { status: "DRAFT" } }),
    db.result.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { role: { in: ["TEACHER", "HEAD_ADMIN", "SUB_ADMIN"] }, status: "ACTIVE" } }),
  ]);

  const pages = Math.max(1, Math.ceil(totalFiltered / take));
  const baseHref = `/admin/students?q=${encodeURIComponent(q)}${classId ? `&classId=${classId}` : ""}`;
  const classOptions = classes.map((c) => ({ id: c.id, name: c.name }));
  const parentOptions = parents.map((p) => ({ id: p.id, name: p.user.name }));

  return (
    <AdminShell
      title="Students"
      description="Issue portal accounts, enroll classes, and manage every pupil record."
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      }
    >
      {/* ── 1. Hero Banner with Illustration & Fast Actions ───────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[var(--c-border)] p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        }}
      >
        <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--c-sky)]/20 bg-[var(--c-ice)] px-3 py-1 text-xs font-semibold text-[var(--c-sky)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-sky)]" />
              Pupil Academic Registry
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--c-text)] sm:text-3xl">
              Manage student portal accounts
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-3)]">
              Create pupil credentials, assign classroom cohorts, connect linked parents for gradebook access, and oversee academic progression.
            </p>
            <StudentsRegistryActions classes={classOptions} parents={parentOptions} />
          </div>
          <div className="shrink-0 drop-shadow-sm">
            <StudentsHeroIllustration className="h-36 w-48 sm:h-44 sm:w-56" />
          </div>
        </div>
      </div>

      {/* ── 2. People Management Quick-Switcher Tabs ───────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/students"
          className="group relative flex items-start gap-3.5 rounded-2xl border-2 border-[var(--c-sky)] bg-[var(--c-surface)] p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--c-ice)] text-[var(--c-sky)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-[var(--c-text)]">Students</span>
              <span className="rounded-full bg-[var(--c-sky)] px-2 py-0.5 text-xs font-bold text-white">
                {activeStudentsCount}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--c-text-3)] leading-tight">
              Create student login · email temp password
            </p>
          </div>
        </Link>

        <Link
          href="/admin/parents"
          className="group relative flex items-start gap-3.5 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 shadow-xs transition hover:border-[var(--c-emerald)]/50 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--c-emerald-pale)] text-[var(--c-emerald)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-[var(--c-text)]">Parents</span>
              <span className="rounded-full bg-[var(--c-surface-3)] px-2 py-0.5 text-xs font-semibold text-[var(--c-text-2)]">
                {activeParentsCount}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--c-text-3)] leading-tight">
              Create parent login · link to students
            </p>
          </div>
        </Link>

        <Link
          href="/admin/administrators"
          className="group relative flex items-start gap-3.5 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 shadow-xs transition hover:border-[var(--c-gold)]/50 hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--c-gold-pale)] text-[#b45309]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-[var(--c-text)]">Teachers & staff</span>
              <span className="rounded-full bg-[var(--c-surface-3)] px-2 py-0.5 text-xs font-semibold text-[var(--c-text-2)]">
                {totalTeachersCount}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--c-text-3)] leading-tight">
              Issue teacher / sub-admin credentials
            </p>
          </div>
        </Link>
      </div>

      {/* ── 3. Overview Statistics Cards ─────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-3)]">
            Academic Overview
          </p>
          <span className="text-xs text-[var(--c-text-3)]">Real-time counts</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--c-text-3)]">Active students</span>
              <span className="h-2 w-2 rounded-full bg-[var(--c-sky)]" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] min-[360px]:text-3xl">
              {activeStudentsCount}
            </p>
            <p className="mt-1 text-[11px] text-[var(--c-text-3)]">Registered pupils</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--c-text-3)]">Active parents</span>
              <span className="h-2 w-2 rounded-full bg-[var(--c-emerald)]" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] min-[360px]:text-3xl">
              {activeParentsCount}
            </p>
            <p className="mt-1 text-[11px] text-[var(--c-text-3)]">Linked guardians</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--c-text-3)]">Active classes</span>
              <span className="h-2 w-2 rounded-full bg-[var(--c-gold)]" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] min-[360px]:text-3xl">
              {activeClassesCount}
            </p>
            <p className="mt-1 text-[11px] text-[var(--c-text-3)]">Grade levels</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--c-text-3)]">Draft results</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] min-[360px]:text-3xl">
              {draftResultsCount}
            </p>
            <p className="mt-1 text-[11px] text-[var(--c-text-3)]">Pending review</p>
          </div>

          <div className="stat-card col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--c-text-3)]">Published results</span>
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] min-[360px]:text-3xl">
              {publishedResultsCount}
            </p>
            <p className="mt-1 text-[11px] text-[var(--c-text-3)]">On parent portal</p>
          </div>
        </div>
      </div>

      {/* ── 4. Directory & Pupil Roster ─────────────────────────────────────────── */}
      <AdminPanel
        title="Directory"
        description={`${totalFiltered} student${totalFiltered === 1 ? "" : "s"} found`}
        actions={
          <AdminSearch
            defaultValue={q}
            placeholder="Search name, admission no, email..."
            extra={
              <select name="classId" defaultValue={classId} className="input-field max-w-[12rem]">
                <option value="">All classes ({classes.length})</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            }
          />
        }
      >
        {students.length ? (
          <div className="space-y-4">
            <AdminTable headers={["Pupil", "Admission No", "Class", "Login Email", "Status", "Actions"]}>
              {students.map((s) => {
                const initials = `${s.firstName[0] || ""}${s.lastName[0] || ""}`.toUpperCase();
                return (
                  <tr key={s.id} className="transition-colors hover:bg-[var(--c-surface-2)]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold text-[var(--c-navy)] shadow-xs"
                          style={{
                            background: "linear-gradient(135deg, var(--c-ice), #d1e3f8)",
                            border: "1px solid var(--c-border)",
                          }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--c-text)]">
                            {s.lastName}, {s.firstName}
                            {s.otherNames ? <span className="ml-1 font-normal text-[var(--c-text-3)]">{s.otherNames}</span> : null}
                          </p>
                          <p className="text-[11px] text-[var(--c-text-3)]">
                            {s.gender ? `Gender: ${s.gender} · ` : ""}
                            {s.parentLinks.length ? `${s.parentLinks.length} guardian linked` : "No guardians"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-medium text-[var(--c-text-2)]">
                      <span className="rounded-md bg-[var(--c-surface-3)] px-2 py-1 border border-[var(--c-border)]">
                        {s.admissionNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {s.class?.name ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c-ice)] px-2.5 py-0.5 text-xs font-semibold text-[var(--c-sky)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-sky)]" />
                          {s.class.name}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--c-text-3)]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[var(--c-text-2)]">
                      {s.user.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill active={s.status === "ACTIVE"} label={s.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/students/${s.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--c-sky)] transition hover:border-[var(--c-sky)] hover:bg-[var(--c-ice)]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
            <Pagination page={page} pages={pages} total={totalFiltered} baseHref={baseHref} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <EmptyStudentsIllustration className="h-36 w-36" />
            <h3 className="mt-4 font-display text-lg font-bold text-[var(--c-text)]">
              No students found
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-[var(--c-text-3)]">
              {q || classId
                ? "No pupil matches your filter criteria. Try resetting your search terms."
                : "Your student roster is currently empty. Register a pupil or import a CSV roster to get started."}
            </p>
            {q || classId ? (
              <div className="mt-5">
                <Link href="/admin/students" className="btn btn-ghost btn-sm rounded-xl">
                  Clear search
                </Link>
              </div>
            ) : (
              <StudentsRegistryActions
                classes={classOptions}
                parents={parentOptions}
                variant="empty"
              />
            )}
          </div>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
