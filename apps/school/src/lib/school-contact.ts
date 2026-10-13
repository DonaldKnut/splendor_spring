/** Convert local NG numbers (0…) to E.164 digits without +. */
export function toWhatsAppDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  return digits;
}

/** Canonical public contact details for Splendor Spring School. */
export const SCHOOL_CONTACT = {
  address: "26, Aganmayo Lane, Apollo, Makoko",
  phones: ["09029308463", "07068447585"] as const,
  phoneDisplay: "09029308463 / 07068447585",
  email: "deroyalesplendorschool@gmail.com",
  whatsapp: "08186431261",
  whatsappMessage:
    "Hello Splendor Spring School, I would like to enquire about admissions.",
  facebook: "https://www.facebook.com/share/19hd4TypHj/",
  proprietor: "Mrs. Opeyemi Elebiju Josephine",
  proprietorTitle: "Founder & Director, Splendor Spring School Ltd.",
} as const;
