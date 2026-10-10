import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(20, "Invalid reset token"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
  confirmPassword: z.string().min(8).max(128),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
  confirmPassword: z.string().min(8).max(128),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const requestOtpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  purpose: z.enum(["VERIFY_EMAIL", "LOGIN_OTP", "RESET_OTP"]).default("VERIFY_EMAIL"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email().max(255),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
  purpose: z.enum(["VERIFY_EMAIL", "LOGIN_OTP", "RESET_OTP"]).default("VERIFY_EMAIL"),
});

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255, "Email is too long"),
  name: z.string().trim().max(120, "Name is too long").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
