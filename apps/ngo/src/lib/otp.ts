import { createHash, randomInt } from "crypto";
import { db } from "@/lib/db";
import { isEmailConfigured, sendOtpEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export type OtpPurpose = "VERIFY_EMAIL" | "LOGIN_OTP" | "RESET_OTP";

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function generateOtpCode() {
  return String(randomInt(100000, 999999));
}

export async function issueEmailOtp(input: {
  userId: string;
  email: string;
  name: string;
  purpose: OtpPurpose;
}) {
  const limited = rateLimit(`otp:${input.purpose}:${input.email}`, 5, 15 * 60_000);
  if (!limited.ok) {
    throw new Error("Too many codes requested. Please try again later.");
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 15 * 60_000);

  await db.emailOtp.updateMany({
    where: {
      userId: input.userId,
      purpose: input.purpose,
      consumedAt: null,
    },
    data: { consumedAt: new Date() },
  });

  await db.emailOtp.create({
    data: {
      userId: input.userId,
      purpose: input.purpose,
      codeHash: hashOtp(code),
      expiresAt,
    },
  });

  const mail = await sendOtpEmail({
    to: input.email,
    name: input.name,
    code,
    purpose: input.purpose,
  });

  return {
    emailed: mail.sent,
    previewCode: mail.sent ? null : code,
    expiresAt,
    emailConfigured: isEmailConfigured(),
    mailError: mail.error,
  };
}

export async function consumeEmailOtp(input: {
  userId: string;
  purpose: OtpPurpose;
  code: string;
}) {
  const record = await db.emailOtp.findFirst({
    where: {
      userId: input.userId,
      purpose: input.purpose,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new Error("Code expired or not found. Request a new one.");
  }

  if (record.attempts >= 5) {
    throw new Error("Too many invalid attempts. Request a new code.");
  }

  if (record.codeHash !== hashOtp(input.code.trim())) {
    await db.emailOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid verification code.");
  }

  await db.emailOtp.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  if (input.purpose === "VERIFY_EMAIL") {
    await db.user.update({
      where: { id: input.userId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  return { ok: true as const };
}
