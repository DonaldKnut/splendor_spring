"use server";

import { newsletterSubscribeSchema } from "@splendor/shared";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function subscribeNewsletter(raw: unknown) {
  const data = newsletterSubscribeSchema.parse(raw);
  const email = data.email.toLowerCase();

  const limited = rateLimit(`newsletter:${email}`, 5, 60 * 60_000);
  if (!limited.ok) {
    throw new Error("Too many attempts. Please try again later.");
  }

  const name = data.name?.trim() || null;

  await db.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      name,
      source: "footer",
      status: "ACTIVE",
    },
    update: {
      name: name ?? undefined,
      status: "ACTIVE",
      source: "footer",
    },
  });

  return { ok: true as const };
}
