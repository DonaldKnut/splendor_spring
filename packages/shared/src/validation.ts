import { z } from "zod";

export const emailSchema = z.string().trim().email().max(255);
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128);
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  // Honeypot — must remain empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export const donationAmountSchema = z.object({
  amount: z.number().positive().max(100_000_000),
  currency: z.string().length(3).default("NGN"),
  email: emailSchema,
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  anonymous: z.boolean().optional().default(false),
  campaignId: z.string().cuid().optional().nullable(),
  message: z.string().trim().max(1000).optional(),
});

export function clampScore(value: number, max: number): number {
  if (Number.isNaN(value) || value < 0) return 0;
  if (value > max) return max;
  return value;
}
