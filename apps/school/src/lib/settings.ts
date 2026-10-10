import { db } from "./db";

const DEFAULTS: Record<string, string> = {
  school_name: "Splendor Spring School",
  school_tagline: "Nurturing to Greater Heights",
  school_motto: "Nurturing to Greater Heights",
  school_proprietor: "Mrs. Opeyemi Elebiju",
  school_address: "26, Aganmayo Lane, Apollo, Makoko",
  school_phone: "09029308463 / 07068447585",
  school_email: "deroyalesplendorschool@gmail.com",
  school_facebook: "https://www.facebook.com/share/19hd4TypHj/",
  school_intro:
    "Splendor Spring School Ltd is a low-cost, child-centred school in Makoko, Lagos — every child deserves the opportunity to learn, grow and reach their full potential.",
  mission:
    "To provide accessible, affordable and quality education in a safe, nurturing and stimulating environment where every child can develop academically, socially, creatively and morally, regardless of their socio-economic background.",
  vision:
    "To raise confident, knowledgeable, compassionate and responsible children who are equipped to reach their full potential and make meaningful contributions to their families, communities and the wider world.",
  values:
    "Excellence, Integrity, Compassion, Respect, Faith, Creativity, Inclusiveness, Service",
  educational_approach:
    "We combine strong foundational academics with opportunities for creativity, practical learning and character development.",
  coming_soon:
    "School events, pupils' achievements, classroom activities, educational projects and community initiatives will be shared regularly through our website and social media platforms.",
  whatsapp_number: process.env.SCHOOL_WHATSAPP_NUMBER ?? "08186431261",
  whatsapp_default_message:
    process.env.SCHOOL_WHATSAPP_DEFAULT_MESSAGE ??
    "Hello Splendor Spring School, I would like to enquire about admissions.",
  ca_max: "40",
  exam_max: "60",
};

export async function getSetting(key: string): Promise<string> {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(keys?: string[]): Promise<Record<string, string>> {
  const rows = await db.setting.findMany({
    where: keys ? { key: { in: keys } } : undefined,
  });
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function setSettings(entries: Record<string, string>) {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
}
