import {
  accountWelcomeEmailTemplate,
  otpEmailTemplate,
  passwordResetEmailTemplate,
  welcomeVerifyEmailTemplate,
} from "@splendor/shared";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailResult = {
  sent: boolean;
  provider?: "resend" | "smtp";
  error?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const from =
    process.env.EMAIL_FROM ||
    process.env.SCHOOL_EMAIL_FROM ||
    "Splendor Spring School <onboarding@resend.dev>";

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });
      if (!res.ok) {
        return { sent: false, provider: "resend", error: await res.text() };
      }
      return { sent: true, provider: "resend" };
    } catch (err) {
      return {
        sent: false,
        provider: "resend",
        error: err instanceof Error ? err.message : "Resend failed",
      };
    }
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // @ts-ignore
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });
      return { sent: true, provider: "smtp" };
    } catch (err) {
      return {
        sent: false,
        provider: "smtp",
        error: err instanceof Error ? err.message : "SMTP failed",
      };
    }
  }

  return { sent: false, error: "No email provider configured" };
}

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  token: string;
  appUrl: string;
  brand?: string;
}): Promise<SendEmailResult> {
  const brand = input.brand || "Splendor Spring School";
  const link = `${input.appUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(input.token)}`;
  const tpl = passwordResetEmailTemplate({ brand, name: input.name, link });
  return sendEmail({ to: input.to, ...tpl });
}

export async function sendOtpEmail(input: {
  to: string;
  name: string;
  code: string;
  purpose: "VERIFY_EMAIL" | "LOGIN_OTP" | "RESET_OTP";
  brand?: string;
}): Promise<SendEmailResult> {
  const brand = input.brand || "Splendor Spring School";
  const labels = {
    VERIFY_EMAIL: "Verify your email",
    LOGIN_OTP: "Your login code",
    RESET_OTP: "Password reset code",
  } as const;

  const tpl =
    input.purpose === "VERIFY_EMAIL"
      ? welcomeVerifyEmailTemplate({ brand, name: input.name, code: input.code })
      : otpEmailTemplate({
          brand,
          name: input.name,
          code: input.code,
          purposeLabel: labels[input.purpose],
          expiresMinutes: 15,
        });

  return sendEmail({ to: input.to, ...tpl });
}

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "student",
  TEACHER: "teacher",
  PARENT: "parent",
  SUB_ADMIN: "sub-admin",
  HEAD_ADMIN: "head admin",
};

export async function sendAccountWelcomeEmail(input: {
  to: string;
  name: string;
  role: string;
  temporaryPassword: string;
  brand?: string;
  appUrl?: string;
}): Promise<SendEmailResult> {
  const brand = input.brand || "Splendor Spring School";
  const appUrl = (
    input.appUrl ||
    process.env.SCHOOL_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  const loginUrl = `${appUrl}/login`;
  const tpl = accountWelcomeEmailTemplate({
    brand,
    name: input.name,
    roleLabel: ROLE_LABELS[input.role] || input.role.toLowerCase(),
    email: input.to,
    temporaryPassword: input.temporaryPassword,
    loginUrl,
  });
  return sendEmail({ to: input.to, ...tpl });
}
