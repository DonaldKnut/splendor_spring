import type {
  DonationFrequency,
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentGateway,
  VerifiedPayment,
  WebhookParseResult,
} from "./types";
import { fetchJson, safeEqualHex, sha256 } from "./utils";

type FlutterwaveInitResponse = {
  status: string;
  message: string;
  data: {
    link: string;
  };
};

type FlutterwavePlanResponse = {
  status: string;
  message: string;
  data: { id: number };
};

type FlutterwaveVerifyResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    processor_response?: string;
  };
};

function flutterwaveInterval(frequency: DonationFrequency): string | null {
  switch (frequency) {
    case "monthly":
      return "monthly";
    case "quarterly":
      return "quarterly";
    case "yearly":
      return "yearly";
    default:
      return null;
  }
}

export class FlutterwaveGateway implements PaymentGateway {
  readonly name = "flutterwave" as const;

  constructor(
    private readonly secretKey: string,
    private readonly webhookSecret: string
  ) {}

  supportsRecurring() {
    return true;
  }

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    if (!this.secretKey || this.secretKey.includes("replace")) {
      throw new Error("Flutterwave secret key is not configured.");
    }

    const interval = input.frequency ? flutterwaveInterval(input.frequency) : null;
    let planCode: string | undefined;

    if (interval) {
      const plan = await fetchJson<FlutterwavePlanResponse>(
        "https://api.flutterwave.com/v3/payment-plans",
        {
          method: "POST",
          secretKey: this.secretKey,
          body: JSON.stringify({
            amount: input.amount,
            name: input.planName || `Donation ${input.frequency}`,
            interval,
            currency: input.currency,
          }),
        }
      );
      if (plan.status !== "success") {
        throw new Error(plan.message || "Unable to create Flutterwave payment plan.");
      }
      planCode = String(plan.data.id);
    }

    const data = await fetchJson<FlutterwaveInitResponse>(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        secretKey: this.secretKey,
        body: JSON.stringify({
          tx_ref: input.reference,
          amount: input.amount,
          currency: input.currency,
          redirect_url: input.callbackUrl,
          customer: {
            email: input.email,
            name: input.customerName,
            phonenumber: input.customerPhone,
          },
          customizations: {
            title: "Donation",
            description: interval ? `Recurring ${interval} donation` : "One-time donation",
          },
          meta: input.metadata,
          ...(planCode ? { payment_plan: Number(planCode) } : {}),
        }),
      }
    );

    if (data.status !== "success") {
      throw new Error(data.message || "Flutterwave init failed.");
    }

    return {
      provider: "flutterwave",
      reference: input.reference,
      authorizationUrl: data.data.link,
      planCode,
      recurring: Boolean(planCode),
    };
  }

  async verify(reference: string): Promise<VerifiedPayment> {
    const data = await fetchJson<FlutterwaveVerifyResponse>(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
      { secretKey: this.secretKey }
    );

    if (data.status !== "success") {
      throw new Error(data.message || "Flutterwave verify failed.");
    }

    const statusMap: Record<string, VerifiedPayment["status"]> = {
      successful: "SUCCESS",
      success: "SUCCESS",
      failed: "FAILED",
      cancelled: "CANCELLED",
      pending: "PENDING",
    };

    return {
      provider: "flutterwave",
      reference: data.data.tx_ref,
      providerReference: data.data.flw_ref || String(data.data.id),
      status: statusMap[data.data.status.toLowerCase()] ?? "PENDING",
      amount: data.data.amount,
      currency: data.data.currency,
      raw: data.data,
      gatewayMessage: data.data.processor_response,
    };
  }

  verifyWebhookSignature(_rawBody: string, signatureHeader: string | null): boolean {
    if (!signatureHeader || !this.webhookSecret) return false;
    return safeEqualHex(
      Buffer.from(signatureHeader, "utf8").toString("hex"),
      Buffer.from(this.webhookSecret, "utf8").toString("hex")
    );
  }

  parseWebhook(rawBody: string): WebhookParseResult {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { tx_ref?: string; flw_ref?: string };
    };
    return {
      eventType: event.event || "unknown",
      reference: event.data?.tx_ref ?? null,
      eventKey: sha256(rawBody),
      rawData: event.data ?? {},
    };
  }
}
