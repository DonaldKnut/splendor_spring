"use server";

import { revalidatePath } from "next/cache";
import { sanitizeRichText } from "@splendor/shared/sanitize";
import { contactFormSchema } from "@splendor/shared/validation";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission, requireRole } from "@/lib/rbac";
import { setSettings } from "@/lib/settings";
import { ALL_PERMISSIONS, type Permission } from "@/lib/permissions";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { slugify } from "@/lib/slug";
import { upsertFundraisingCampaign } from "@/lib/actions/engagement";

export async function upsertPage(input: {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  pageType?: string;
  featured?: boolean;
}) {
  const actor = await requirePermission("manage_content");
  const slug = input.slug?.trim() || slugify(input.title);
  const content = sanitizeRichText(input.content);
  const data = {
    title: input.title.trim(),
    slug,
    content,
    excerpt: input.excerpt?.trim() || null,
    metaTitle: input.metaTitle?.trim() || null,
    metaDescription: input.metaDescription?.trim() || null,
    status: input.status,
    pageType: input.pageType || "page",
    featured: input.featured ?? false,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  };
  const page = input.id
    ? await db.contentPage.update({ where: { id: input.id }, data })
    : await db.contentPage.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_PAGE" : "CREATE_PAGE",
    entityType: "ContentPage",
    entityId: page.id,
  });
  revalidatePath("/admin/content");
  revalidatePath("/");
  return page;
}

export async function upsertProgramme(input: {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured?: boolean;
}) {
  const actor = await requirePermission("manage_programmes");
  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    title: input.title.trim(),
    slug,
    summary: input.summary?.trim() || null,
    content: sanitizeRichText(input.content),
    status: input.status,
    featured: input.featured ?? false,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  };
  const item = input.id
    ? await db.programme.update({ where: { id: input.id }, data })
    : await db.programme.create({ data });
  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_PROGRAMME" : "CREATE_PROGRAMME",
    entityType: "Programme",
    entityId: item.id,
  });
  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
  return item;
}

export async function upsertCampaign(input: {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  goalAmount?: number | null;
  currency?: string;
  coverImage?: string;
  featured?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  programmeId?: string | null;
  eventId?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  return upsertFundraisingCampaign(input);
}

export async function updateOrgSettings(entries: Record<string, string>) {
  const actor = await requirePermission("manage_settings");
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(entries)) {
    cleaned[k] = ["org_intro", "mission", "vision", "values"].includes(k)
      ? sanitizeRichText(v)
      : v.trim();
  }
  await setSettings(cleaned);
  await writeAuditLog({
    actorId: actor.id,
    action: "UPDATE_SETTINGS",
    entityType: "Setting",
    metadata: { keys: Object.keys(cleaned) },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
}

export async function submitContact(raw: unknown) {
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form");
  if (parsed.data.website) return { ok: true };
  await db.contactSubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });
  revalidatePath("/admin/contacts");
  return { ok: true };
}

export async function markContactHandled(id: string) {
  const actor = await requirePermission("view_contacts");
  await db.contactSubmission.update({
    where: { id },
    data: { status: "HANDLED", handledById: actor.id },
  });
  revalidatePath("/admin/contacts");
}

export async function createSubAdmin(input: {
  name: string;
  email: string;
  permissions: string[];
}) {
  const actor = await requireRole("HEAD_ADMIN");
  const email = input.email.trim().toLowerCase();
  if (await db.user.findUnique({ where: { email } })) {
    throw new Error("Email already in use.");
  }
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  const perms = input.permissions.filter((p) =>
    ALL_PERMISSIONS.includes(p as Permission)
  );
  const user = await db.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      role: "SUB_ADMIN",
      mustChangePassword: true,
      permissions: { create: perms.map((permission) => ({ permission })) },
    },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "CREATE_SUB_ADMIN",
    entityType: "User",
    entityId: user.id,
  });
  revalidatePath("/admin/administrators");
  return { email, temporaryPassword };
}

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  const { requireSession } = await import("@/lib/rbac");
  const sessionUser = await requireSession();
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
  const user = await db.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) throw new Error("Unauthorized");

  if (!user.mustChangePassword) {
    if (!currentPassword) throw new Error("Current password is required.");
    const { verifyPassword } = await import("@/lib/password");
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) throw new Error("Current password is incorrect.");
  }

  if (currentPassword && currentPassword === newPassword) {
    throw new Error("New password must be different from your current password.");
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      mustChangePassword: false,
    },
  });
  return { ok: true };
}
