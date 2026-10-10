import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, EmptyState, PageHeader } from "@/components/ui";

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

  const student = await db.student.findUnique({ where: { id: studentId } });
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Admission No: ${student.admissionNumber}`}
      />
      {sessions.length ? (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card key={s.id}>
              <h2 className="font-display text-lg">{s.name}</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {s.terms.map((t) => (
                  <li key={t.id}>
                    <Link
                      className="text-forest underline"
                      href={`/portal/parent/${studentId}/results?sessionId=${s.id}&termId=${t.id}`}
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No published results for this student yet" />
      )}
    </div>
  );
}
