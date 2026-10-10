/**
 * WhatsApp click-to-chat helpers.
 * Number must be digits only (E.164 without +), e.g. 2348012345678.
 */
export function buildWhatsAppUrl(
  phoneDigits: string | null | undefined,
  message?: string | null
): string | null {
  if (!phoneDigits) return null;
  const digits = phoneDigits.replace(/\D/g, "");
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function isValidWhatsAppNumber(value: string | null | undefined): boolean {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
