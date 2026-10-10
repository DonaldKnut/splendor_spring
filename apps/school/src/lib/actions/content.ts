"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sanitizeRichText } from "@splendor/shared/sanitize";
import { contactFormSchema } from "@splendor/shared/validation";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/lib/rbac";
import { rateLimit } from "@/lib/rate-limit";
import { setSettings } from "@/lib/settings";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export async function upsertContentPage(input: {
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
  const data = z
    .object({
      id: z.string().cuid().optional(),
      title: z.string().trim().min(2).max(200),
      slug: z.string().trim().max(120).optional(),
      content: z.string().min(1),
      excerpt: z.string().max(500).optional(),
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300).optional(),
      status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      pageType: z.string().max(40).optional(),
      featured: z.boolean().optional(),
    })
    .parse(input);

  const slug = data.slug?.trim() || slugify(data.title);
  const content = sanitizeRichText(data.content);
  const publishedAt =
    data.status === "PUBLISHED" ? new Date() : null;

  const page = data.id
    ? await db.contentPage.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug,
          content,
          excerpt: data.excerpt || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          status: data.status,
          pageType: data.pageType || "page",
          featured: data.featured ?? false,
          publishedAt:
            data.status === "PUBLISHED"
              ? publishedAt
              : undefined,
        },
      })
    : await db.contentPage.create({
        data: {
          title: data.title,
          slug,
          content,
          excerpt: data.excerpt || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          status: data.status,
          pageType: data.pageType || "page",
          featured: data.featured ?? false,
          publishedAt,
        },
      });

  await writeAuditLog({
    actorId: actor.id,
    action: data.id ? "UPDATE_PAGE" : "CREATE_PAGE",
    entityType: "ContentPage",
    entityId: page.id,
  });

  revalidatePath("/admin/content");
  revalidatePath(`/${slug}`);
  revalidatePath("/about");
  return page;
}

export async function upsertAnnouncement(input: {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
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
    status: input.status,
    featured: input.featured ?? false,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  };

  const item = input.id
    ? await db.announcement.update({ where: { id: input.id }, data })
    : await db.announcement.create({ data });

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_ANNOUNCEMENT" : "CREATE_ANNOUNCEMENT",
    entityType: "Announcement",
    entityId: item.id,
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidatePath("/announcements");
  return item;
}

export async function updateSchoolSettings(entries: Record<string, string>) {
  const actor = await requirePermission("manage_settings");
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    cleaned[key] = typeof value === "string" ? value.trim() : "";
  }
  if (cleaned.school_intro) {
    cleaned.school_intro = sanitizeRichText(cleaned.school_intro);
  }
  if (cleaned.mission) cleaned.mission = sanitizeRichText(cleaned.mission);
  if (cleaned.vision) cleaned.vision = sanitizeRichText(cleaned.vision);
  if (cleaned.values) cleaned.values = sanitizeRichText(cleaned.values);

  await setSettings(cleaned);
  await writeAuditLog({
    actorId: actor.id,
    action: "UPDATE_SETTINGS",
    entityType: "Setting",
    metadata: { keys: Object.keys(cleaned) },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export async function submitContactForm(raw: unknown, ip?: string) {
  const limited = rateLimit(`contact:${ip ?? "unknown"}`, 8, 60_000);
  if (!limited.ok) {
    throw new Error("Too many submissions. Please try again later.");
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data.");
  }

  // Honeypot
  if (parsed.data.website) {
    return { ok: true };
  }

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

export async function markContactHandled(id: string, notes?: string) {
  const actor = await requirePermission("view_contacts");
  await db.contactSubmission.update({
    where: { id },
    data: {
      status: "HANDLED",
      handledById: actor.id,
      notes: notes?.trim() || null,
    },
  });
  revalidatePath("/admin/contacts");
}
