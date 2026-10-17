"use server";

import { loginSchema, requestOtpSchema, verifyOtpSchema } from "@splendor/shared";
import { db } from "@/lib/db";
import { consumeEmailOtp, issueEmailOtp } from "@/lib/otp";
import { verifyPassword } from "@/lib/password";

export async function sendVerificationOtp(raw: unknown) {
  const data = requestOtpSchema.parse(raw);
  const user = await db.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (!user || user.status !== "ACTIVE") {
    return { ok: true, emailed: false, previewCode: null as string | null };
  }
  if (user.emailVerifiedAt && data.purpose === "VERIFY_EMAIL") {
    return { ok: true, alreadyVerified: true, emailed: false, previewCode: null };
  }

  const issued = await issueEmailOtp({
    userId: user.id,
    email: user.email,
    name: user.name,
    purpose: data.purpose,
  });

  return { ok: true, alreadyVerified: false, ...issued };
}

export async function verifyEmailOtp(raw: unknown) {
  const data = verifyOtpSchema.parse(raw);
  const user = await db.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (!user || user.status !== "ACTIVE") {
    throw new Error("Account not found.");
  }

  await consumeEmailOtp({
    userId: user.id,
    purpose: data.purpose,
    code: data.code,
  });

  return { ok: true, email: user.email };
}

export async function preflightLogin(raw: unknown) {
  const data = loginSchema.parse(raw);
  const email = data.email.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE") {
    throw new Error("Invalid email or password.");
  }
  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password.");

  if (!user.emailVerifiedAt) {
    const issued = await issueEmailOtp({
      userId: user.id,
      email: user.email,
      name: user.name,
      purpose: "VERIFY_EMAIL",
    });
    return {
      status: "VERIFY_EMAIL" as const,
      email: user.email,
      ...issued,
    };
  }

  return {
    status: "READY" as const,
    email: user.email,
    mustChangePassword: user.mustChangePassword,
  };
}
