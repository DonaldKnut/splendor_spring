import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPublishedResultsForStudent } from "@/lib/actions/results";
import { getSettings } from "@/lib/settings";
import { ResultSheet } from "@/components/result-sheet";

export default async function ParentResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ sessionId?: string; termId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PARENT") redirect("/login");

  const { studentId } = await params;
  const sp = await searchParams;
  if (!sp.sessionId || !sp.termId) redirect(`/portal/parent/${studentId}`);

  const parent = await db.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: { children: true },
  });
  if (!parent?.children.some((c) => c.studentId === studentId)) notFound();

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) notFound();

  const [results, settings] = await Promise.all([
    getPublishedResultsForStudent(studentId, sp.sessionId, sp.termId),
    getSettings(["school_name"]),
  ]);

  return (
    <ResultSheet
      schoolName={settings.school_name}
      studentName={`${student.firstName} ${student.lastName}`}
      admissionNumber={student.admissionNumber}
      results={results.map((r) => ({
        subject: r.subject.name,
        caScore: r.caScore,
        examScore: r.examScore,
        totalScore: r.totalScore,
        grade: r.grade,
        remark: r.remark,
        teacherComment: r.teacherComment,
        className: r.class.name,
        sessionName: r.session.name,
        termName: r.term.name,
        publishedAt: r.publishedAt,
      }))}
      backHref={`/portal/parent/${studentId}`}
    />
  );
}
