import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, isValidWhatsAppNumber } from "@splendor/shared/whatsapp";

describe("whatsapp helpers", () => {
  it("builds encoded urls", () => {
    expect(buildWhatsAppUrl("2348012345678", "Hello there")).toBe(
      "https://wa.me/2348012345678?text=Hello%20there"
    );
  });

  it("rejects empty numbers", () => {
    expect(buildWhatsAppUrl("")).toBeNull();
    expect(isValidWhatsAppNumber("123")).toBe(false);
    expect(isValidWhatsAppNumber("2348012345678")).toBe(true);
  });
});
