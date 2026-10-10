export type PaymentProviderName = "paystack" | "flutterwave";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "ABANDONED";

export type DonationFrequency = "one_time" | "monthly" | "quarterly" | "yearly";

export type InitializePaymentInput = {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  customerName?: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
  /** When set (and not one_time), gateways create/use a recurring plan. */
  frequency?: DonationFrequency;
  planName?: string;
};

export type InitializePaymentResult = {
  provider: PaymentProviderName;
  reference: string;
  authorizationUrl: string;
  accessCode?: string;
  planCode?: string;
  recurring?: boolean;
};

export type VerifiedPayment = {
  provider: PaymentProviderName;
  reference: string;
  providerReference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  raw: unknown;
  gatewayMessage?: string;
};

export type WebhookParseResult = {
  eventType: string;
  reference: string | null;
  eventKey: string;
  rawData: unknown;
};

/**
 * SOLID — Interface Segregation / Dependency Inversion:
 * App code depends on this contract, not on Paystack/Flutterwave specifics.
 */
export interface PaymentGateway {
  readonly name: PaymentProviderName;
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifiedPayment>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean;
  parseWebhook(rawBody: string): WebhookParseResult;
  supportsRecurring(): boolean;
}

export type PaymentEnv = {
  defaultProvider: PaymentProviderName;
  currency: string;
  appUrl: string;
  paystack: {
    secretKey: string;
    publicKey: string;
    webhookSecret: string;
  };
  flutterwave: {
    secretKey: string;
    publicKey: string;
    webhookSecret: string;
  };
};

export function isProviderConfigured(
  env: PaymentEnv,
  provider: PaymentProviderName
): boolean {
  if (provider === "paystack") {
    const { secretKey, publicKey } = env.paystack;
    return Boolean(
      secretKey &&
        publicKey &&
        !secretKey.includes("replace") &&
        !publicKey.includes("replace")
    );
  }
  const { secretKey, publicKey } = env.flutterwave;
  return Boolean(
    secretKey &&
      publicKey &&
      !secretKey.includes("replace") &&
      !publicKey.includes("replace")
  );
}
