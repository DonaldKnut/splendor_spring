import { db } from "./db";

const DEFAULTS: Record<string, string> = {
  org_name: "Organisation",
  org_tagline: "Serving communities with integrity",
  org_intro:
    "Welcome. Organisation details are managed by administrators and will appear here once published.",
  mission: "",
  vision: "",
  values: "",
  org_address: "",
  org_phone: "",
  org_email: "",
  whatsapp_number: process.env.NGO_WHATSAPP_NUMBER ?? "",
  whatsapp_default_message:
    process.env.NGO_WHATSAPP_DEFAULT_MESSAGE ??
    "Hello, I would like to learn more about your organisation.",
};

export async function getSettings(keys?: string[]) {
  const rows = await db.setting.findMany({
    where: keys ? { key: { in: keys } } : undefined,
  });
  const map = { ...DEFAULTS };
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
