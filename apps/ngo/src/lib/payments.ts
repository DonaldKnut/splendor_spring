import {
  createPaymentGateway,
  listConfiguredProviders,
  loadPaymentEnvFromProcess,
  type PaymentProviderName,
} from "@splendor/payments";

export function getPaymentEnv() {
  return loadPaymentEnvFromProcess();
}

export function getGateway(provider?: PaymentProviderName) {
  return createPaymentGateway(getPaymentEnv(), provider);
}

export function getConfiguredProviders() {
  return listConfiguredProviders(getPaymentEnv());
}
