"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { AuthError, requirePermission, requireRole, requireSession } from "@/lib/rbac";
import {
  ALL_PERMISSIONS,
  TEACHER_DEFAULT_PERMISSIONS,
  type Permission,
} from "@/lib/permissions";
import {
  generateResetToken,
  generateTemporaryPassword,
  hashPassword,
  hashToken,
} from "@/lib/password";
import { sendAccountWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";

const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  permissions: z.array(z.string()).default([]),
});

export async function createSubAdmin(input: z.infer<typeof createAdminSchema>) {
  const actor = await requireRole("HEAD_ADMIN");
  const data = createAdminSchema.parse(input);
  const email = data.email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("A user with this email already exists.");

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);
  const perms = data.permissions.filter((p) =>
    ALL_PERMISSIONS.includes(p as Permission)
  ) as Permission[];

  const user = await db.user.create({
    data: {
      name: data.name,
      email,
      passwordHash,
      role: "SUB_ADMIN",
      status: "ACTIVE",
      mustChangePassword: true,
      createdById: actor.id,
      permissions: {
        create: perms.map((permission) => ({ permission })),
      },
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_SUB_ADMIN",
    entityType: "User",
    entityId: user.id,
    metadata: { email, permissions: perms },
  });

  const mail = await sendAccountWelcomeEmail({
    to: email,
    name: user.name,
    role: "SUB_ADMIN",
    temporaryPassword: tempPassword,
  });

  revalidatePath("/admin/administrators");
  return {
    userId: user.id,
    email,
    temporaryPassword: tempPassword,
    emailed: mail.sent,
  };
}

export async function createTeacher(input: {
  name: string;
  email: string;
  permissions?: string[];
}) {
  const actor = await requireRole("HEAD_ADMIN");
  const email = input.email.trim().toLowerCase();
  if (await db.user.findUnique({ where: { email } })) {
    throw new Error("A user with this email already exists.");
  }

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);
  const requested = (input.permissions ?? TEACHER_DEFAULT_PERMISSIONS).filter((p) =>
    ALL_PERMISSIONS.includes(p as Permission)
  ) as Permission[];
  // Teachers may never receive head-admin-only style privileges
  const blocked = new Set<Permission>([
    "manage_settings",
    "view_audit",
    "manage_parents",
  ]);
  const perms = requested.filter((p) => !blocked.has(p));

  const user = await db.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      role: "TEACHER",
      status: "ACTIVE",
      mustChangePassword: true,
      createdById: actor.id,
      permissions: {
        create: perms.map((permission) => ({ permission })),
      },
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_TEACHER",
    entityType: "User",
    entityId: user.id,
    metadata: { email, permissions: perms },
  });

  const mail = await sendAccountWelcomeEmail({
    to: email,
    name: user.name,
    role: "TEACHER",
    temporaryPassword: tempPassword,
  });

  revalidatePath("/admin/administrators");
  return {
    userId: user.id,
    email,
    temporaryPassword: tempPassword,
    emailed: mail.sent,
  };
}

export async function updateSubAdminPermissions(
  userId: string,
  permissions: string[]
) {
  const actor = await requireRole("HEAD_ADMIN");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "SUB_ADMIN" && user.role !== "TEACHER")) {
    throw new Error("Staff member not found.");
  }

  let perms = permissions.filter((p) =>
    ALL_PERMISSIONS.includes(p as Permission)
  ) as Permission[];

  if (user.role === "TEACHER") {
    const blocked = new Set<Permission>([
      "manage_settings",
      "view_audit",
      "manage_parents",
    ]);
    perms = perms.filter((p) => !blocked.has(p));
  }

  await db.$transaction([
    db.subAdminPermission.deleteMany({ where: { userId } }),
    db.subAdminPermission.createMany({
      data: perms.map((permission) => ({ userId, permission })),
    }),
  ]);

  await writeAuditLog({
    actorId: actor.id,
    action: "UPDATE_STAFF_PERMISSIONS",
    entityType: "User",
    entityId: userId,
    metadata: { role: user.role, permissions: perms },
  });

  revalidatePath("/admin/administrators");
}

export async function setUserStatus(userId: string, status: "ACTIVE" | "INACTIVE") {
  const actor = await requireRole("HEAD_ADMIN");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");
  if (user.role === "HEAD_ADMIN" && status === "INACTIVE") {
    throw new Error("Cannot deactivate the Head Admin account this way.");
  }

  await db.user.update({ where: { id: userId }, data: { status } });
  await writeAuditLog({
    actorId: actor.id,
    action: status === "ACTIVE" ? "ACTIVATE_USER" : "DEACTIVATE_USER",
    entityType: "User",
    entityId: userId,
  });
  revalidatePath("/admin/administrators");
  revalidatePath("/admin/students");
  revalidatePath("/admin/parents");
}

export async function resetUserPassword(userId: string) {
  const actor = await requireRole("HEAD_ADMIN");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  await db.user.update({
    where: { id: userId },
    data: { passwordHash, mustChangePassword: true },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "RESEND_CREDENTIALS",
    entityType: "User",
    entityId: userId,
    metadata: { email: user.email, role: user.role },
  });

  const mail = await sendAccountWelcomeEmail({
    to: user.email,
    name: user.name,
    role: user.role,
    temporaryPassword,
  });

  revalidatePath("/admin/administrators");
  revalidatePath("/admin/students");
  revalidatePath("/admin/parents");

  return {
    email: user.email,
    temporaryPassword,
    emailed: mail.sent,
  };
}

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  const sessionUser = await requireSession();
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");

  const user = await db.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) throw new AuthError("Unauthorized", 401);

  // Forced first-login change: user already proved the temp/seed password at sign-in.
  if (!user.mustChangePassword) {
    if (!currentPassword) throw new Error("Current password is required.");
    const { verifyPassword } = await import("@/lib/password");
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) throw new Error("Current password is incorrect.");
  }

  if (currentPassword && currentPassword === newPassword) {
    throw new Error("New password must be different from your current password.");
  }

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash, mustChangePassword: false },
  });

  await writeAuditLog({
    actorId: user.id,
    action: "CHANGE_PASSWORD",
    entityType: "User",
    entityId: user.id,
  });

  return { ok: true };
}

export async function requestPasswordReset(emailRaw: string) {
  const { forgotPasswordSchema } = await import("@splendor/shared");
  const email = forgotPasswordSchema.parse({ email: emailRaw }).email.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  // Always return success-shaped response to avoid account enumeration
  if (!user || user.status !== "ACTIVE") {
    return { ok: true, emailed: false, token: null as string | null };
  }

  const token = generateResetToken();
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const appUrl =
    process.env.SCHOOL_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const mail = await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    token,
    appUrl,
  });

  // Only expose the raw token when email is not configured (local/admin-assisted recovery).
  return {
    ok: true,
    emailed: mail.sent,
    token: mail.sent ? null : token,
  };
}

export async function completePasswordReset(token: string, newPassword: string) {
  const { resetPasswordSchema } = await import("@splendor/shared");
  const parsed = resetPasswordSchema.safeParse({
    token,
    password: newPassword,
    confirmPassword: newPassword,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid password.");
  }
  const tokenHash = hashToken(parsed.data.token);
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired reset token.");
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { passwordHash, mustChangePassword: false },
    }),
    db.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}

export async function requireContentManager() {
  return requirePermission("manage_content");
}
