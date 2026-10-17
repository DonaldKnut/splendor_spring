"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { createHash } from "crypto";
import { sanitizeRichText } from "@splendor/shared/sanitize";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/lib/rbac";
import { slugify } from "@/lib/slug";

type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type GrantStatus = "DRAFT" | "OPEN" | "CLOSED" | "AWARDED" | "ARCHIVED";
type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "ARCHIVED";
type PollStatus = "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";

function parseDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function upsertFundraisingCampaign(input: {
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
  status: ContentStatus;
}) {
  const actor = await requirePermission("manage_campaigns");
  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    title: input.title.trim(),
    slug,
    summary: input.summary?.trim() || null,
    description: input.description?.trim() || null,
    goalAmount: input.goalAmount ?? null,
    currency: (input.currency || "NGN").toUpperCase(),
    coverImage: input.coverImage?.trim() || null,
    featured: input.featured ?? false,
    startsAt: parseDate(input.startsAt),
    endsAt: parseDate(input.endsAt),
    programmeId: input.programmeId || null,
    eventId: input.eventId || null,
    status: input.status,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  };

  const item = input.id
    ? await db.campaign.update({ where: { id: input.id }, data })
    : await db.campaign.create({ data });

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_CAMPAIGN" : "CREATE_CAMPAIGN",
    entityType: "Campaign",
    entityId: item.id,
  });

  revalidatePath("/admin/fundraising");
  revalidatePath("/admin/campaigns");
  revalidatePath("/donate");
  revalidatePath("/");
  return item;
}

export async function setCampaignStatus(id: string, status: ContentStatus) {
  const actor = await requirePermission("manage_campaigns");
  const item = await db.campaign.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_CAMPAIGN_STATUS",
    entityType: "Campaign",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/admin/fundraising");
  revalidatePath("/donate");
  return item;
}

export async function upsertGrant(input: {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  description: string;
  amountMin?: number | null;
  amountMax?: number | null;
  currency?: string;
  category?: string;
  eligibility?: string;
  applicationUrl?: string;
  deadline?: string | null;
  featured?: boolean;
  programmeId?: string | null;
  status: GrantStatus;
}) {
  const actor = await requirePermission("manage_grants");
  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    title: input.title.trim(),
    slug,
    summary: input.summary?.trim() || null,
    description: sanitizeRichText(input.description),
    amountMin: input.amountMin ?? null,
    amountMax: input.amountMax ?? null,
    currency: (input.currency || "NGN").toUpperCase(),
    category: input.category?.trim() || null,
    eligibility: input.eligibility?.trim() || null,
    applicationUrl: input.applicationUrl?.trim() || null,
    deadline: parseDate(input.deadline),
    featured: input.featured ?? false,
    programmeId: input.programmeId || null,
    status: input.status,
    publishedAt: input.status === "OPEN" ? new Date() : null,
  };

  const item = input.id
    ? await db.grant.update({ where: { id: input.id }, data })
    : await db.grant.create({ data });

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_GRANT" : "CREATE_GRANT",
    entityType: "Grant",
    entityId: item.id,
  });

  revalidatePath("/admin/grants");
  revalidatePath("/grants");
  revalidatePath("/");
  return item;
}

export async function setGrantStatus(id: string, status: GrantStatus) {
  const actor = await requirePermission("manage_grants");
  const item = await db.grant.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "OPEN" ? new Date() : undefined,
    },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_GRANT_STATUS",
    entityType: "Grant",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/admin/grants");
  revalidatePath("/grants");
  return item;
}

export async function upsertEvent(input: {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  description: string;
  venue?: string;
  location?: string;
  coverImage?: string;
  startsAt: string;
  endsAt?: string | null;
  capacity?: number | null;
  featured?: boolean;
  programmeId?: string | null;
  status: EventStatus;
}) {
  const actor = await requirePermission("manage_events");
  const startsAt = parseDate(input.startsAt);
  if (!startsAt) throw new Error("Event start date is required.");

  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    title: input.title.trim(),
    slug,
    summary: input.summary?.trim() || null,
    description: sanitizeRichText(input.description),
    venue: input.venue?.trim() || null,
    location: input.location?.trim() || null,
    coverImage: input.coverImage?.trim() || null,
    startsAt,
    endsAt: parseDate(input.endsAt),
    capacity: input.capacity ?? null,
    featured: input.featured ?? false,
    programmeId: input.programmeId || null,
    status: input.status,
    publishedAt: input.status === "PUBLISHED" ? new Date() : null,
  };

  const item = input.id
    ? await db.event.update({ where: { id: input.id }, data })
    : await db.event.create({ data });

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_EVENT" : "CREATE_EVENT",
    entityType: "Event",
    entityId: item.id,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return item;
}

export async function setEventStatus(id: string, status: EventStatus) {
  const actor = await requirePermission("manage_events");
  const item = await db.event.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_EVENT_STATUS",
    entityType: "Event",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return item;
}

export async function upsertPoll(input: {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  allowMultiple?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  eventId?: string | null;
  status: PollStatus;
  options: string[];
}) {
  const actor = await requirePermission("manage_polls");
  const options = input.options.map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) throw new Error("Add at least two poll options.");

  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    title: input.title.trim(),
    slug,
    description: input.description?.trim() || null,
    allowMultiple: input.allowMultiple ?? false,
    startsAt: parseDate(input.startsAt),
    endsAt: parseDate(input.endsAt),
    eventId: input.eventId || null,
    status: input.status,
    publishedAt: input.status === "OPEN" ? new Date() : null,
  };

  let pollId = input.id;
  if (input.id) {
    await db.poll.update({ where: { id: input.id }, data });
    await db.pollOption.deleteMany({ where: { pollId: input.id } });
    await db.pollOption.createMany({
      data: options.map((label, sortOrder) => ({
        pollId: input.id!,
        label,
        sortOrder,
      })),
    });
  } else {
    const created = await db.poll.create({
      data: {
        ...data,
        options: {
          create: options.map((label, sortOrder) => ({ label, sortOrder })),
        },
      },
    });
    pollId = created.id;
  }

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "UPDATE_POLL" : "CREATE_POLL",
    entityType: "Poll",
    entityId: pollId,
  });

  revalidatePath("/admin/polls");
  revalidatePath("/polls");
  revalidatePath("/");
  return { id: pollId };
}

export async function setPollStatus(id: string, status: PollStatus) {
  const actor = await requirePermission("manage_polls");
  const item = await db.poll.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "OPEN" ? new Date() : undefined,
    },
  });
  await writeAuditLog({
    actorId: actor.id,
    action: "SET_POLL_STATUS",
    entityType: "Poll",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/admin/polls");
  revalidatePath("/polls");
  return item;
}

async function voterFingerprint() {
  const h = await headers();
  const c = await cookies();
  const existing = c.get("ngo_voter")?.value;
  if (existing) return existing;
  const raw = `${h.get("user-agent") || "ua"}:${h.get("x-forwarded-for") || "ip"}:${Date.now()}:${Math.random()}`;
  const key = createHash("sha256").update(raw).digest("hex").slice(0, 32);
  c.set("ngo_voter", key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return key;
}

export async function castPollVote(input: { pollId: string; optionIds: string[] }) {
  const poll = await db.poll.findUnique({
    where: { id: input.pollId },
    include: { options: true },
  });
  if (!poll || poll.status !== "OPEN") throw new Error("This poll is not open.");
  const now = new Date();
  if (poll.startsAt && poll.startsAt > now) throw new Error("This poll has not started.");
  if (poll.endsAt && poll.endsAt < now) throw new Error("This poll has closed.");

  const valid = new Set(poll.options.map((o) => o.id));
  const optionIds = [...new Set(input.optionIds)].filter((id) => valid.has(id));
  if (!optionIds.length) throw new Error("Choose at least one option.");
  if (!poll.allowMultiple && optionIds.length > 1) {
    throw new Error("This poll allows only one choice.");
  }

  const voterKey = await voterFingerprint();
  const existing = await db.pollVote.count({ where: { pollId: poll.id, voterKey } });
  if (existing > 0) throw new Error("You already voted in this poll.");

  await db.pollVote.createMany({
    data: optionIds.map((optionId) => ({
      pollId: poll.id,
      optionId,
      voterKey,
    })),
  });

  revalidatePath(`/polls/${poll.slug}`);
  revalidatePath("/polls");
  revalidatePath("/admin/polls");
  return { ok: true };
}
