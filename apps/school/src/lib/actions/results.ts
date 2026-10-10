"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission, requireSession } from "@/lib/rbac";
import { assignGrade, computeTotal, getScoreLimits, validateScores } from "@/lib/grades";

const entrySchema = z.object({
  studentId: z.string().cuid(),
  classId: z.string().cuid(),
  subjectId: z.string().cuid(),
  sessionId: z.string().cuid(),
  termId: z.string().cuid(),
  caScore: z.number(),
  examScore: z.number(),
  teacherComment: z.string().trim().max(500).optional().nullable(),
});

async function assertEnrollment(
  studentId: string,
  classId: string,
  sessionId: string
) {
  const enrollment = await db.enrollment.findUnique({
    where: { studentId_sessionId: { studentId, sessionId } },
  });
  if (!enrollment || enrollment.classId !== classId || enrollment.status !== "ACTIVE") {
    throw new Error(
      "Student is not enrolled in this class for the selected academic session."
    );
  }
}

export async function saveResultDraft(input: z.infer<typeof entrySchema>) {
  const actor = await requirePermission("enter_results");
  const data = entrySchema.parse(input);
  const { caMax, examMax } = await getScoreLimits();
  const invalid = validateScores(data.caScore, data.examScore, caMax, examMax);
  if (invalid) throw new Error(invalid);

  await assertEnrollment(data.studentId, data.classId, data.sessionId);

  const term = await db.term.findUnique({ where: { id: data.termId } });
  if (!term || term.sessionId !== data.sessionId) {
    throw new Error("Term does not belong to the selected session.");
  }

  const totalScore = computeTotal(data.caScore, data.examScore);
  const { grade, remark } = await assignGrade(totalScore);

  const existing = await db.result.findUnique({
    where: {
      studentId_subjectId_termId: {
        studentId: data.studentId,
        subjectId: data.subjectId,
        termId: data.termId,
      },
    },
  });

  if (existing?.status === "PUBLISHED" || existing?.status === "CORRECTED") {
    await requirePermission("edit_results");
    // Corrections go through correctPublishedResult
    throw new Error(
      "Published results cannot be silently altered. Use the correction workflow."
    );
  }

  const canEdit = existing
    ? (await requirePermission("edit_results").catch(() => null)) ||
      (await requirePermission("enter_results"))
    : actor;

  void canEdit;

  const result = await db.result.upsert({
    where: {
      studentId_subjectId_termId: {
        studentId: data.studentId,
        subjectId: data.subjectId,
        termId: data.termId,
      },
    },
    create: {
      ...data,
      totalScore,
      grade,
      remark,
      status: "DRAFT",
      teacherComment: data.teacherComment || null,
    },
    update: {
      caScore: data.caScore,
      examScore: data.examScore,
      totalScore,
      grade,
      remark,
      teacherComment: data.teacherComment || null,
      classId: data.classId,
      sessionId: data.sessionId,
      status: "DRAFT",
    },
  });

  await db.resultHistory.create({
    data: {
      resultId: result.id,
      action: existing ? "UPDATE_DRAFT" : "CREATE_DRAFT",
      actorId: actor.id,
      caScore: data.caScore,
      examScore: data.examScore,
      totalScore,
      grade,
      status: "DRAFT",
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: existing ? "UPDATE_RESULT_DRAFT" : "CREATE_RESULT_DRAFT",
    entityType: "Result",
    entityId: result.id,
  });

  revalidatePath("/admin/results");
  return result;
}

export async function bulkSaveResultDrafts(
  rows: Array<z.infer<typeof entrySchema>>
) {
  await requirePermission("enter_results");
  const saved = [];
  const errors: Array<{ studentId: string; message: string }> = [];
  for (const row of rows) {
    try {
      saved.push(await saveResultDraft(row));
    } catch (e) {
      errors.push({
        studentId: row.studentId,
        message: e instanceof Error ? e.message : "Failed",
      });
    }
  }
  return { savedCount: saved.length, errors };
}

export async function publishResults(filter: {
  classId: string;
  subjectId: string;
  termId: string;
  sessionId: string;
}) {
  const actor = await requirePermission("publish_results");
  const drafts = await db.result.findMany({
    where: {
      classId: filter.classId,
      subjectId: filter.subjectId,
      termId: filter.termId,
      sessionId: filter.sessionId,
      status: "DRAFT",
    },
  });

  if (!drafts.length) throw new Error("No draft results found to publish.");

  const incomplete = drafts.filter(
    (r) => r.caScore == null || r.examScore == null || r.totalScore == null
  );
  if (incomplete.length) {
    throw new Error(
      `${incomplete.length} result(s) are incomplete and cannot be published.`
    );
  }

  const now = new Date();
  await db.$transaction(async (tx) => {
    for (const draft of drafts) {
      await tx.result.update({
        where: { id: draft.id },
        data: {
          status: "PUBLISHED",
          publishedAt: now,
          publishedById: actor.id,
        },
      });
      await tx.resultHistory.create({
        data: {
          resultId: draft.id,
          action: "PUBLISH",
          actorId: actor.id,
          caScore: draft.caScore,
          examScore: draft.examScore,
          totalScore: draft.totalScore,
          grade: draft.grade,
          status: "PUBLISHED",
        },
      });
    }
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "PUBLISH_RESULTS",
    entityType: "Result",
    metadata: { ...filter, count: drafts.length },
  });

  revalidatePath("/admin/results");
  revalidatePath("/admin/results/publish");
  return { published: drafts.length };
}

export async function correctPublishedResult(input: {
  resultId: string;
  caScore: number;
  examScore: number;
  teacherComment?: string | null;
  correctionNote: string;
}) {
  const actor = await requirePermission("publish_results");
  const { caMax, examMax } = await getScoreLimits();
  const invalid = validateScores(input.caScore, input.examScore, caMax, examMax);
  if (invalid) throw new Error(invalid);
  if (!input.correctionNote.trim()) {
    throw new Error("A correction note is required.");
  }

  const existing = await db.result.findUnique({ where: { id: input.resultId } });
  if (!existing || (existing.status !== "PUBLISHED" && existing.status !== "CORRECTED")) {
    throw new Error("Only published results can be corrected.");
  }

  const totalScore = computeTotal(input.caScore, input.examScore);
  const { grade, remark } = await assignGrade(totalScore);

  const updated = await db.result.update({
    where: { id: input.resultId },
    data: {
      caScore: input.caScore,
      examScore: input.examScore,
      totalScore,
      grade,
      remark,
      teacherComment: input.teacherComment ?? existing.teacherComment,
      status: "CORRECTED",
      correctedAt: new Date(),
      correctedById: actor.id,
      correctionNote: input.correctionNote.trim(),
    },
  });

  await db.resultHistory.create({
    data: {
      resultId: updated.id,
      action: "CORRECT",
      actorId: actor.id,
      caScore: input.caScore,
      examScore: input.examScore,
      totalScore,
      grade,
      status: "CORRECTED",
      note: input.correctionNote.trim(),
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CORRECT_RESULT",
    entityType: "Result",
    entityId: updated.id,
    metadata: { note: input.correctionNote.trim() },
  });

  revalidatePath("/admin/results");
  return updated;
}

export async function getPublishedResultsForStudent(
  studentId: string,
  sessionId: string,
  termId: string
) {
  const user = await requireSession();

  if (user.role === "STUDENT") {
    const student = await db.student.findUnique({ where: { userId: user.id } });
    if (!student || student.id !== studentId) {
      throw new Error("Forbidden");
    }
  } else if (user.role === "PARENT") {
    const parent = await db.parentProfile.findUnique({
      where: { userId: user.id },
      include: { children: true },
    });
    const linked = parent?.children.some((c) => c.studentId === studentId);
    if (!linked) throw new Error("Forbidden");
  } else if (user.role !== "HEAD_ADMIN" && user.role !== "SUB_ADMIN") {
    throw new Error("Forbidden");
  }

  return db.result.findMany({
    where: {
      studentId,
      sessionId,
      termId,
      status: { in: ["PUBLISHED", "CORRECTED"] },
    },
    include: {
      subject: true,
      class: true,
      session: true,
      term: true,
      student: true,
    },
    orderBy: { subject: { name: "asc" } },
  });
}
