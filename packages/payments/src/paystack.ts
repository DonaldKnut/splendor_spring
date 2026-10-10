import type {
  DonationFrequency,
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentGateway,
  VerifiedPayment,
  WebhookParseResult,
} from "./types";
import {
  fetchJson,
  fromSubunit,
  safeEqualHex,
  sha256,
  sha512Hmac,
  toSubunit,
} from "./utils";

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackPlanResponse = {
  status: boolean;
  message: string;
  data: { plan_code: string };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    gateway_response?: string;
    id?: number;
  };
};

function paystackInterval(frequency: DonationFrequency): string | null {
  switch (frequency) {
    case "monthly":
      return "monthly";
    case "quarterly":
      return "quarterly";
    case "yearly":
      return "annually";
    default:
      return null;
  }
}

export class PaystackGateway implements PaymentGateway {
  readonly name = "paystack" as const;

  constructor(
    private readonly secretKey: string,
    private readonly webhookSecret: string
  ) {}

  supportsRecurring() {
    return true;
  }

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    if (!this.secretKey || this.secretKey.includes("replace")) {
      throw new Error("Paystack secret key is not configured.");
    }

    const interval = input.frequency ? paystackInterval(input.frequency) : null;
    let planCode: string | undefined;

    if (interval) {
      const plan = await fetchJson<PaystackPlanResponse>(
        "https://api.paystack.co/plan",
        {
          method: "POST",
          secretKey: this.secretKey,
          body: JSON.stringify({
            name: input.planName || `Donation ${input.frequency} ${input.amount}`,
            interval,
            amount: toSubunit(input.amount),
            currency: input.currency,
          }),
        }
      );
      if (!plan.status) throw new Error(plan.message || "Unable to create Paystack plan.");
      planCode = plan.data.plan_code;
    }

    const data = await fetchJson<PaystackInitResponse>(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        secretKey: this.secretKey,
        body: JSON.stringify({
          email: input.email,
          amount: toSubunit(input.amount),
          reference: input.reference,
          currency: input.currency,
          callback_url: input.callbackUrl,
          metadata: input.metadata,
          ...(planCode ? { plan: planCode } : {}),
        }),
      }
    );

    if (!data.status) throw new Error(data.message || "Paystack init failed.");

    return {
      provider: "paystack",
      reference: data.data.reference,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      planCode,
      recurring: Boolean(planCode),
    };
  }

  async verify(reference: string): Promise<VerifiedPayment> {
    const data = await fetchJson<PaystackVerifyResponse>(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { secretKey: this.secretKey }
    );

    if (!data.status) throw new Error(data.message || "Paystack verify failed.");

    const statusMap: Record<string, VerifiedPayment["status"]> = {
      success: "SUCCESS",
      failed: "FAILED",
      abandoned: "ABANDONED",
      reversed: "FAILED",
      ongoing: "PENDING",
      pending: "PENDING",
    };

    return {
      provider: "paystack",
      reference: data.data.reference,
      providerReference: String(data.data.id ?? data.data.reference),
      status: statusMap[data.data.status] ?? "PENDING",
      amount: fromSubunit(data.data.amount),
      currency: data.data.currency,
      raw: data.data,
      gatewayMessage: data.data.gateway_response,
    };
  }

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!signatureHeader) return false;
    const secret = this.webhookSecret || this.secretKey;
    if (!secret) return false;
    const hash = sha512Hmac(secret, rawBody);
    return safeEqualHex(hash, signatureHeader);
  }

  parseWebhook(rawBody: string): WebhookParseResult {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string };
    };
    return {
      eventType: event.event || "unknown",
      reference: event.data?.reference ?? null,
      eventKey: sha256(rawBody),
      rawData: event.data ?? {},
    };
  }
}
