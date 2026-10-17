"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPaymentReference, type PaymentProviderName } from "@splendor/payments";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { requirePermission } from "@/lib/rbac";
import { getConfiguredProviders, getGateway, getPaymentEnv } from "@/lib/payments";

const donationSchema = z.object({
  amount: z.number().positive().max(100_000_000),
  currency: z.string().length(3).default("NGN"),
  email: z.string().email(),
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  anonymous: z.boolean().optional().default(false),
  campaignId: z.string().cuid().optional().nullable(),
  message: z.string().trim().max(1000).optional(),
  provider: z.enum(["paystack", "flutterwave"]).optional(),
  frequency: z.enum(["one_time", "monthly", "quarterly", "yearly"]).default("one_time"),
});

export async function initializeDonation(input: unknown) {
  const parsed = donationSchema.parse(input);
  const env = getPaymentEnv();
  const configured = getConfiguredProviders();
  if (!configured.length) {
    throw new Error(
      "No payment provider configured. Set Paystack and/or Flutterwave keys in .env."
    );
  }

  const provider = (parsed.provider || env.defaultProvider) as PaymentProviderName;
  if (!configured.includes(provider)) {
    throw new Error(
      `${provider} is not configured. Available: ${configured.join(", ")}`
    );
  }

  if (parsed.campaignId) {
    const campaign = await db.campaign.findFirst({
      where: { id: parsed.campaignId, status: "PUBLISHED" },
    });
    if (!campaign) throw new Error("Campaign not found or not published.");
  }

  const gateway = getGateway(provider);
  if (parsed.frequency !== "one_time" && !gateway.supportsRecurring()) {
    throw new Error(`${provider} does not support recurring donations in this integration.`);
  }

  const reference = createPaymentReference("ngo");
  await db.donation.create({
    data: {
      reference,
      amount: parsed.amount,
      currency: parsed.currency || env.currency,
      donorName: parsed.anonymous ? null : parsed.name || null,
      donorEmail: parsed.email.toLowerCase(),
      donorPhone: parsed.phone || null,
      anonymous: parsed.anonymous ?? false,
      message: parsed.message || null,
      campaignId: parsed.campaignId || null,
      status: "PENDING",
      provider,
      frequency: parsed.frequency,
      recurring: parsed.frequency !== "one_time",
    },
  });

  const init = await gateway.initialize({
    email: parsed.email.toLowerCase(),
    amount: parsed.amount,
    currency: parsed.currency || env.currency,
    reference,
    callbackUrl: `${env.appUrl}/donate/verify?reference=${encodeURIComponent(reference)}&provider=${provider}`,
    customerName: parsed.name,
    customerPhone: parsed.phone,
    frequency: parsed.frequency,
    planName: `NGO donation ${parsed.frequency}`,
    metadata: {
      donationReference: reference,
      campaignId: parsed.campaignId || null,
      anonymous: parsed.anonymous ?? false,
      frequency: parsed.frequency,
    },
  });

  if (init.planCode) {
    await db.donation.update({
      where: { reference },
      data: { planCode: init.planCode, recurring: Boolean(init.recurring) },
    });
  }

  return {
    reference,
    provider,
    authorizationUrl: init.authorizationUrl,
    recurring: Boolean(init.recurring),
  };
}

export async function confirmDonationFromProvider(
  reference: string,
  providerHint?: PaymentProviderName
) {
  const donation = await db.donation.findUnique({ where: { reference } });
  if (!donation) throw new Error("Donation not found.");
  if (donation.status === "SUCCESS") {
    return { donation, alreadyVerified: true };
  }

  const provider = (providerHint || donation.provider || "paystack") as PaymentProviderName;
  const gateway = getGateway(provider);
  const verified = await gateway.verify(reference);

  const amountMatches = Math.abs(verified.amount - donation.amount) < 0.01;
  const currencyMatches =
    verified.currency?.toUpperCase() === donation.currency.toUpperCase();

  let status = verified.status;
  if (status === "SUCCESS" && (!amountMatches || !currencyMatches)) {
    status = "FAILED";
  }

  const updated = await db.donation.update({
    where: { id: donation.id },
    data: {
      status,
      provider,
      providerReference: verified.providerReference,
      providerPayload: JSON.stringify(verified.raw),
      verifiedAt: status === "SUCCESS" ? new Date() : donation.verifiedAt,
      failureReason:
        status === "FAILED"
          ? !amountMatches
            ? "Amount mismatch during verification"
            : !currencyMatches
              ? "Currency mismatch during verification"
              : verified.gatewayMessage || verified.status
          : null,
    },
  });

  revalidatePath("/admin/donations");
  revalidatePath("/admin");
  return { donation: updated, alreadyVerified: false, providerStatus: verified.status };
}

export async function processProviderWebhook(
  provider: PaymentProviderName,
  rawBody: string,
  signatureHeader: string | null
) {
  const gateway = getGateway(provider);
  if (!gateway.verifyWebhookSignature(rawBody, signatureHeader)) {
    throw new Error("Invalid webhook signature");
  }

  const parsed = gateway.parseWebhook(rawBody);
  const existing = await db.paymentEvent.findUnique({ where: { eventKey: parsed.eventKey } });
  if (existing) return { duplicate: true };

  let donationId: string | null = null;
  if (parsed.reference) {
    const donation = await db.donation.findUnique({ where: { reference: parsed.reference } });
    donationId = donation?.id ?? null;
    if (donation && donation.status !== "SUCCESS") {
      // Never trust webhook body alone — re-verify with provider API
      await confirmDonationFromProvider(parsed.reference, provider);
    }
  }

  await db.paymentEvent.create({
    data: {
      eventKey: parsed.eventKey,
      eventType: `${provider}:${parsed.eventType}`,
      donationId,
      payload: rawBody,
    },
  });

  return { duplicate: false };
}

export async function exportDonationsCsv(filters?: {
  status?: string;
  from?: string;
  to?: string;
}) {
  const actor = await requirePermission("export_donations");
  const where: {
    status?: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "ABANDONED";
    createdAt?: { gte?: Date; lte?: Date };
  } = {};
  if (filters?.status) where.status = filters.status as typeof where.status;
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }

  const rows = await db.donation.findMany({
    where,
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "EXPORT_DONATIONS",
    entityType: "Donation",
    metadata: { count: rows.length, filters },
  });

  const header = [
    "reference",
    "provider",
    "status",
    "amount",
    "currency",
    "donorName",
    "donorEmail",
    "anonymous",
    "campaign",
    "createdAt",
    "verifiedAt",
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.reference,
        r.provider,
        r.status,
        r.amount,
        r.currency,
        r.anonymous ? "" : r.donorName ?? "",
        r.anonymous ? "" : r.donorEmail,
        r.anonymous,
        r.campaign?.title ?? "",
        r.createdAt.toISOString(),
        r.verifiedAt?.toISOString() ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  return lines.join("\n");
}
