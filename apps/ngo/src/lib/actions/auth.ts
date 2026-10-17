"use server";

import { forgotPasswordSchema, resetPasswordSchema } from "@splendor/shared";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateResetToken, hashPassword, hashToken } from "@/lib/password";

export async function requestPasswordReset(emailRaw: string) {
  const data = forgotPasswordSchema.parse({ email: emailRaw });
  const email = data.email.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
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
    process.env.NGO_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3001";
  const mail = await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    token,
    appUrl,
  });

  return {
    ok: true,
    emailed: mail.sent,
    token: mail.sent ? null : token,
  };
}

export async function completePasswordReset(token: string, newPassword: string) {
  const parsed = resetPasswordSchema.safeParse({
    token,
    password: newPassword,
    confirmPassword: newPassword,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid password.");
  }

  const tokenHash = hashToken(token);
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
