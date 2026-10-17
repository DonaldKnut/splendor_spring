import { describe, expect, it } from "vitest";
import { createDonationReference, fromSubunit, toSubunit, verifyPaystackSignature } from "../paystack";

describe("paystack helpers", () => {
  it("converts subunits", () => {
    expect(toSubunit(25.5)).toBe(2550);
    expect(fromSubunit(2550)).toBe(25.5);
  });

  it("creates unique references", () => {
    const a = createDonationReference();
    const b = createDonationReference();
    expect(a).toMatch(/^ngo_/);
    expect(a).not.toBe(b);
  });

  it("rejects invalid signatures", () => {
    process.env.PAYSTACK_WEBHOOK_SECRET = "test-secret";
    expect(verifyPaystackSignature('{"ok":true}', "bad")).toBe(false);
    expect(verifyPaystackSignature('{"ok":true}', null)).toBe(false);
  });
});
