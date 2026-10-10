"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/lib/rbac";

export async function upsertClass(input: {
  id?: string;
  name: string;
  code: string;
  level?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const actor = await requirePermission("manage_classes");
  const data = z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().trim().min(1).max(80),
      code: z.string().trim().min(1).max(40),
      level: z.string().trim().max(40).optional(),
      description: z.string().trim().max(500).optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
    })
    .parse(input);

  const record = data.id
    ? await db.schoolClass.update({
        where: { id: data.id },
        data: {
          name: data.name,
          code: data.code,
          level: data.level || null,
          description: data.description || null,
          sortOrder: data.sortOrder ?? 0,
          isActive: data.isActive ?? true,
        },
      })
    : await db.schoolClass.create({
        data: {
          name: data.name,
          code: data.code,
          level: data.level || null,
          description: data.description || null,
          sortOrder: data.sortOrder ?? 0,
          isActive: data.isActive ?? true,
        },
      });

  await writeAuditLog({
    actorId: actor.id,
    action: data.id ? "UPDATE_CLASS" : "CREATE_CLASS",
    entityType: "SchoolClass",
    entityId: record.id,
  });
  revalidatePath("/admin/classes");
  return record;
}

export async function upsertSubject(input: {
  id?: string;
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}) {
  const actor = await requirePermission("manage_subjects");
  const data = z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().trim().min(1).max(80),
      code: z.string().trim().min(1).max(40),
      description: z.string().trim().max(500).optional(),
      isActive: z.boolean().optional(),
    })
    .parse(input);

  const record = data.id
    ? await db.subject.update({
        where: { id: data.id },
        data: {
          name: data.name,
          code: data.code,
          description: data.description || null,
          isActive: data.isActive ?? true,
        },
      })
    : await db.subject.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description || null,
          isActive: data.isActive ?? true,
        },
      });

  await writeAuditLog({
    actorId: actor.id,
    action: data.id ? "UPDATE_SUBJECT" : "CREATE_SUBJECT",
    entityType: "Subject",
    entityId: record.id,
  });
  revalidatePath("/admin/subjects");
  return record;
}

export async function assignSubjectToClass(classId: string, subjectId: string) {
  await requirePermission("manage_classes");
  await db.classSubject.upsert({
    where: { classId_subjectId: { classId, subjectId } },
    create: { classId, subjectId },
    update: {},
  });
  revalidatePath("/admin/classes");
}

export async function unassignSubjectFromClass(classId: string, subjectId: string) {
  await requirePermission("manage_classes");
  await db.classSubject.delete({
    where: { classId_subjectId: { classId, subjectId } },
  });
  revalidatePath("/admin/classes");
}

export async function createSession(input: {
  name: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}) {
  const actor = await requirePermission("manage_sessions");
  const name = input.name.trim();

  if (input.isCurrent) {
    await db.academicSession.updateMany({ data: { isCurrent: false } });
  }

  const session = await db.academicSession.create({
    data: {
      name,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      isCurrent: !!input.isCurrent,
    },
  });

  // Default three terms
  await db.term.createMany({
    data: [
      { sessionId: session.id, name: "First Term", sortOrder: 1 },
      { sessionId: session.id, name: "Second Term", sortOrder: 2 },
      { sessionId: session.id, name: "Third Term", sortOrder: 3 },
    ],
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_SESSION",
    entityType: "AcademicSession",
    entityId: session.id,
  });
  revalidatePath("/admin/sessions");
  return session;
}

export async function setCurrentSession(sessionId: string) {
  const actor = await requirePermission("manage_sessions");
  await db.$transaction([
    db.academicSession.updateMany({ data: { isCurrent: false } }),
    db.academicSession.update({ where: { id: sessionId }, data: { isCurrent: true } }),
  ]);
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_CURRENT_SESSION",
    entityType: "AcademicSession",
    entityId: sessionId,
  });
  revalidatePath("/admin/sessions");
}

export async function setCurrentTerm(termId: string) {
  const actor = await requirePermission("manage_sessions");
  const term = await db.term.findUnique({ where: { id: termId } });
  if (!term) throw new Error("Term not found.");
  await db.$transaction([
    db.term.updateMany({
      where: { sessionId: term.sessionId },
      data: { isCurrent: false },
    }),
    db.term.update({ where: { id: termId }, data: { isCurrent: true } }),
  ]);
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_CURRENT_TERM",
    entityType: "Term",
    entityId: termId,
  });
  revalidatePath("/admin/sessions");
}

export async function enrollStudent(input: {
  studentId: string;
  classId: string;
  sessionId: string;
}) {
  const actor = await requirePermission("manage_students");
  const enrollment = await db.enrollment.upsert({
    where: {
      studentId_sessionId: {
        studentId: input.studentId,
        sessionId: input.sessionId,
      },
    },
    create: {
      studentId: input.studentId,
      classId: input.classId,
      sessionId: input.sessionId,
      status: "ACTIVE",
    },
    update: { classId: input.classId, status: "ACTIVE" },
  });

  await db.student.update({
    where: { id: input.studentId },
    data: { classId: input.classId },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "ENROLL_STUDENT",
    entityType: "Enrollment",
    entityId: enrollment.id,
  });
  revalidatePath("/admin/students");
  return enrollment;
}
