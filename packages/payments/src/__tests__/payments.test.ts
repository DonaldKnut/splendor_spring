import { describe, expect, it } from "vitest";
import { createPaymentReference, fromSubunit, toSubunit } from "../utils";
import { PaystackGateway } from "../paystack";

describe("payment utils", () => {
  it("converts subunits", () => {
    expect(toSubunit(10)).toBe(1000);
    expect(fromSubunit(1000)).toBe(10);
  });

  it("creates references", () => {
    expect(createPaymentReference("ngo")).toMatch(/^ngo_/);
  });
});

describe("paystack webhook signature", () => {
  it("validates hmac", () => {
    const gateway = new PaystackGateway("sk_test", "whsec");
    const body = '{"event":"charge.success"}';
    const { createHmac } = require("crypto") as typeof import("crypto");
    const sig = createHmac("sha512", "whsec").update(body).digest("hex");
    expect(gateway.verifyWebhookSignature(body, sig)).toBe(true);
    expect(gateway.verifyWebhookSignature(body, "bad")).toBe(false);
  });
});
