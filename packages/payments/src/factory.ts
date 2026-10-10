import { FlutterwaveGateway } from "./flutterwave";
import { PaystackGateway } from "./paystack";
import {
  isProviderConfigured,
  type PaymentEnv,
  type PaymentGateway,
  type PaymentProviderName,
} from "./types";

/**
 * Open/Closed + Factory: add providers without changing call sites.
 */
export function createPaymentGateway(
  env: PaymentEnv,
  provider?: PaymentProviderName
): PaymentGateway {
  const selected = provider ?? env.defaultProvider;

  if (!isProviderConfigured(env, selected)) {
    throw new Error(
      `${selected} is not configured. Add public/secret keys in environment variables.`
    );
  }

  if (selected === "flutterwave") {
    return new FlutterwaveGateway(
      env.flutterwave.secretKey,
      env.flutterwave.webhookSecret || env.flutterwave.secretKey
    );
  }

  return new PaystackGateway(
    env.paystack.secretKey,
    env.paystack.webhookSecret || env.paystack.secretKey
  );
}

export function listConfiguredProviders(env: PaymentEnv): PaymentProviderName[] {
  const list: PaymentProviderName[] = [];
  if (isProviderConfigured(env, "paystack")) list.push("paystack");
  if (isProviderConfigured(env, "flutterwave")) list.push("flutterwave");
  return list;
}

export function loadPaymentEnvFromProcess(
  overrides?: Partial<{
    defaultProvider: PaymentProviderName;
    currency: string;
    appUrl: string;
  }>
): PaymentEnv {
  const defaultProvider = (overrides?.defaultProvider ||
    process.env.PAYMENT_PROVIDER ||
    "paystack") as PaymentProviderName;

  return {
    defaultProvider,
    currency: overrides?.currency || process.env.PAYMENT_CURRENCY || "NGN",
    appUrl:
      overrides?.appUrl ||
      process.env.NGO_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3001",
    paystack: {
      secretKey: process.env.PAYSTACK_SECRET_KEY || "",
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
      webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || "",
    },
    flutterwave: {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || "",
      webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET || "",
    },
  };
}
