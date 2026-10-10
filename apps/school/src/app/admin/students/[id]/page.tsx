import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import { AdminShell, AdminPanel, StatusPill } from "@/components/admin-chrome";
import {
  EditStudentForm,
  EnrollStudentForm,
} from "@/components/forms/student-forms";
import { StudentActions } from "@/components/forms/student-actions";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("view_students");
  const { id } = await params;
  const [student, classes, parents, sessions] = await Promise.all([
    db.student.findUnique({
      where: { id },
      include: {
        user: true,
        class: true,
        parentLinks: { include: { parent: { include: { user: true } } } },
        enrollments: {
          include: { session: true, class: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.schoolClass.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.parentProfile.findMany({ include: { user: true }, orderBy: { user: { name: "asc" } } }),
    db.academicSession.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (!student) notFound();

  return (
    <AdminShell
      title={`${student.firstName} ${student.lastName}`}
      description={`Admission ${student.admissionNumber}`}
      actions={
        <Link href="/admin/students" className="text-sm font-semibold text-[var(--c-sky)] hover:underline">
          ← All students
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Account & access">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--c-text-3)]">Email</dt>
              <dd className="font-medium text-[var(--c-text)]">{student.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--c-text-3)]">Class</dt>
              <dd>{student.class?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--c-text-3)]">Record status</dt>
              <dd>
                <StatusPill active={student.status === "ACTIVE"} label={student.status} />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--c-text-3)]">Login status</dt>
              <dd>
                <Badge tone={student.user.status === "ACTIVE" ? "green" : "red"}>
                  {student.user.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--c-text-3)]">Parents</dt>
              <dd className="mt-1">
                {student.parentLinks.length
                  ? student.parentLinks.map((l) => l.parent.user.name).join(", ")
                  : "None linked"}
              </dd>
            </div>
          </dl>
          <StudentActions userId={student.userId} status={student.user.status} />
        </AdminPanel>

        <AdminPanel
          title="Enrollments"
          description="Assign this student to a class for an academic session."
        >
          <ul className="mb-4 space-y-2 text-sm">
            {student.enrollments.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-[var(--c-border)] px-3 py-2"
              >
                <span>
                  {e.session.name} — {e.class.name}
                </span>
                <Badge tone={e.status === "ACTIVE" ? "green" : "gray"}>{e.status}</Badge>
              </li>
            ))}
            {!student.enrollments.length ? (
              <li className="text-[var(--c-text-3)]">No enrollments yet.</li>
            ) : null}
          </ul>
          <EnrollStudentForm
            studentId={student.id}
            classes={classes.map((c) => ({ id: c.id, name: c.name }))}
            sessions={sessions.map((s) => ({ id: s.id, name: s.name }))}
          />
        </AdminPanel>
      </div>

      <AdminPanel title="Edit profile" description="Update biographic details and parent links.">
        <EditStudentForm
          studentId={student.id}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          parents={parents.map((p) => ({ id: p.id, name: p.user.name }))}
          initial={{
            admissionNumber: student.admissionNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            otherNames: student.otherNames,
            email: student.user.email,
            classId: student.classId,
            gender: student.gender,
            notes: student.notes,
            parentIds: student.parentLinks.map((l) => l.parentId),
          }}
        />
      </AdminPanel>
    </AdminShell>
  );
}
