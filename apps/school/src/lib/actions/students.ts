"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission, requireRole } from "@/lib/rbac";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { sendAccountWelcomeEmail } from "@/lib/email";

const studentSchema = z.object({
  admissionNumber: z.string().trim().min(2).max(40),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  otherNames: z.string().trim().max(80).optional().nullable(),
  email: z.string().trim().email().max(255),
  classId: z.string().cuid().optional().nullable(),
  gender: z.string().trim().max(20).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  parentIds: z.array(z.string().cuid()).optional().default([]),
});

export async function createStudent(input: z.infer<typeof studentSchema>) {
  const actor = await requirePermission("manage_students");
  const data = studentSchema.parse(input);
  const email = data.email.toLowerCase();

  if (await db.user.findUnique({ where: { email } })) {
    throw new Error("Email already in use.");
  }
  if (await db.student.findUnique({ where: { admissionNumber: data.admissionNumber } })) {
    throw new Error("Admission number already exists.");
  }

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);
  const name = `${data.firstName} ${data.lastName}`.trim();

  const student = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
        mustChangePassword: true,
        createdById: actor.id,
      },
    });

    const created = await tx.student.create({
      data: {
        userId: user.id,
        admissionNumber: data.admissionNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        otherNames: data.otherNames || null,
        classId: data.classId || null,
        gender: data.gender || null,
        notes: data.notes || null,
      },
    });

    if (data.parentIds?.length) {
      await tx.parentStudent.createMany({
        data: data.parentIds.map((parentId) => ({
          parentId,
          studentId: created.id,
        })),
      });
    }

    const currentSession = await tx.academicSession.findFirst({
      where: { isCurrent: true },
    });
    if (currentSession && data.classId) {
      await tx.enrollment.upsert({
        where: {
          studentId_sessionId: {
            studentId: created.id,
            sessionId: currentSession.id,
          },
        },
        create: {
          studentId: created.id,
          sessionId: currentSession.id,
          classId: data.classId,
          status: "ACTIVE",
        },
        update: { classId: data.classId, status: "ACTIVE" },
      });
    }

    return created;
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_STUDENT",
    entityType: "Student",
    entityId: student.id,
    metadata: { admissionNumber: data.admissionNumber, email },
  });

  const mail = await sendAccountWelcomeEmail({
    to: email,
    name,
    role: "STUDENT",
    temporaryPassword: tempPassword,
  });

  revalidatePath("/admin/students");
  return {
    studentId: student.id,
    email,
    temporaryPassword: tempPassword,
    emailed: mail.sent,
  };
}

export async function updateStudent(
  studentId: string,
  input: Omit<z.infer<typeof studentSchema>, "email"> & { email?: string }
) {
  const actor = await requirePermission("manage_students");
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });
  if (!student) throw new Error("Student not found.");

  const data = studentSchema.partial().parse(input);

  await db.$transaction(async (tx) => {
    await tx.student.update({
      where: { id: studentId },
      data: {
        admissionNumber: data.admissionNumber ?? student.admissionNumber,
        firstName: data.firstName ?? student.firstName,
        lastName: data.lastName ?? student.lastName,
        otherNames: data.otherNames === undefined ? student.otherNames : data.otherNames,
        classId: data.classId === undefined ? student.classId : data.classId,
        gender: data.gender === undefined ? student.gender : data.gender,
        notes: data.notes === undefined ? student.notes : data.notes,
      },
    });

    const name = `${data.firstName ?? student.firstName} ${data.lastName ?? student.lastName}`.trim();
    await tx.user.update({
      where: { id: student.userId },
      data: {
        name,
        ...(data.email ? { email: data.email.toLowerCase() } : {}),
      },
    });

    if (data.parentIds) {
      await tx.parentStudent.deleteMany({ where: { studentId } });
      if (data.parentIds.length) {
        await tx.parentStudent.createMany({
          data: data.parentIds.map((parentId) => ({ parentId, studentId })),
        });
      }
    }
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "UPDATE_STUDENT",
    entityType: "Student",
    entityId: studentId,
  });

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
}

export async function createParent(input: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  studentIds?: string[];
}) {
  const actor = await requirePermission("manage_parents");
  const email = input.email.trim().toLowerCase();
  if (await db.user.findUnique({ where: { email } })) {
    throw new Error("Email already in use.");
  }

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);

  const parent = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name: input.name.trim(),
        passwordHash,
        role: "PARENT",
        status: "ACTIVE",
        mustChangePassword: true,
        createdById: actor.id,
      },
    });
    const profile = await tx.parentProfile.create({
      data: {
        userId: user.id,
        phone: input.phone?.trim() || null,
        address: input.address?.trim() || null,
      },
    });
    if (input.studentIds?.length) {
      await tx.parentStudent.createMany({
        data: input.studentIds.map((studentId) => ({
          parentId: profile.id,
          studentId,
        })),
      });
    }
    return profile;
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_PARENT",
    entityType: "ParentProfile",
    entityId: parent.id,
    metadata: { email },
  });

  const mail = await sendAccountWelcomeEmail({
    to: email,
    name: input.name.trim(),
    role: "PARENT",
    temporaryPassword: tempPassword,
  });

  revalidatePath("/admin/parents");
  return {
    parentId: parent.id,
    email,
    temporaryPassword: tempPassword,
    emailed: mail.sent,
  };
}

export async function linkParentToStudent(parentId: string, studentId: string) {
  await requirePermission("manage_parents");
  await db.parentStudent.upsert({
    where: { parentId_studentId: { parentId, studentId } },
    create: { parentId, studentId },
    update: {},
  });
  revalidatePath("/admin/parents");
  revalidatePath("/admin/students");
}

export async function importStudentsCsv(csvText: string) {
  const actor = await requirePermission("manage_students");
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must include a header and at least one row.");

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const required = ["admissionnumber", "firstname", "lastname", "email"];
  for (const r of required) {
    if (!header.includes(r)) throw new Error(`Missing CSV column: ${r}`);
  }

  const results: Array<{ row: number; ok: boolean; message: string }> = [];
  let created = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = cols[idx] ?? "";
    });

    try {
      await createStudent({
        admissionNumber: row.admissionnumber,
        firstName: row.firstname,
        lastName: row.lastname,
        email: row.email,
        otherNames: row.othernames || null,
        gender: row.gender || null,
        classId: row.classid || null,
        notes: row.notes || null,
        parentIds: [],
      });
      created += 1;
      results.push({ row: i + 1, ok: true, message: "Created" });
    } catch (e) {
      results.push({
        row: i + 1,
        ok: false,
        message: e instanceof Error ? e.message : "Failed",
      });
    }
  }

  await writeAuditLog({
    actorId: actor.id,
    action: "IMPORT_STUDENTS_CSV",
    entityType: "Student",
    metadata: { created, total: lines.length - 1 },
  });

  return { created, results };
}

export async function ensureCanViewStudents() {
  return requirePermission("view_students");
}

export async function ensureHeadAdmin() {
  return requireRole("HEAD_ADMIN");
}
