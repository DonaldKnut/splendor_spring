import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPublishedResultsForStudent } from "@/lib/actions/results";
import { getSettings } from "@/lib/settings";
import { ResultSheet } from "@/components/result-sheet";

export default async function StudentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; termId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "STUDENT") redirect("/login");

  const student = await db.student.findUnique({ where: { userId: session.user.id } });
  if (!student) redirect("/login");

  const sp = await searchParams;
  if (!sp.sessionId || !sp.termId) redirect("/portal/student");

  const [results, settings] = await Promise.all([
    getPublishedResultsForStudent(student.id, sp.sessionId, sp.termId),
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
      backHref="/portal/student"
    />
  );
}
