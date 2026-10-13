import { db } from "./db";

const DEFAULTS: Record<string, string> = {
  school_name: "Splendor Spring School",
  school_tagline: "Nurturing to Greater Heights",
  school_motto: "Nurturing to Greater Heights",
  school_proprietor: "Mrs. Opeyemi Elebiju Josephine",
  school_address: "26, Aganmayo Lane, Apollo, Makoko",
  school_phone: "09029308463 / 07068447585",
  school_email: "deroyalesplendorschool@gmail.com",
  school_facebook: "https://www.facebook.com/share/19hd4TypHj/",
  school_intro:
    "Splendor Spring School Ltd is a child-centred school in Makoko, Lagos. We believe every child deserves the opportunity to learn, grow and fulfil their God-given potential, regardless of their family's financial circumstances. We provide affordable education to children from low-income families and offer free education to those whose parents genuinely cannot afford school fees.",
  mission:
    "To provide accessible, affordable and quality education — including free education for children whose parents genuinely cannot afford fees — in a safe, caring environment where every child can grow academically, socially and morally.",
  vision:
    "To raise confident, knowledgeable, compassionate and responsible children who can reach their full potential and serve their families and communities.",
  values:
    "Excellence, Integrity, Compassion, Godly values and moral integrity, Inclusiveness, Service",
  educational_approach:
    "We combine strong reading, writing and mathematics with practical learning, creative arts and character development — so children understand what they learn and how to use it.",
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
  try {
    const row = await db.setting.findUnique({ where: { key } });
    return row?.value ?? DEFAULTS[key] ?? "";
  } catch {
    return DEFAULTS[key] ?? "";
  }
}

export async function getSettings(keys?: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = { ...DEFAULTS };
  try {
    const rows = await db.setting.findMany({
      where: keys ? { key: { in: keys } } : undefined,
    });
    for (const row of rows) map[row.key] = row.value;
  } catch {
    // Build / offline DB — serve brand defaults so prerender never crashes.
  }
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
