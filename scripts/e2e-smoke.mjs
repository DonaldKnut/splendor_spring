/**
 * Lightweight API/DB smoke checks (requires Postgres + seeded data).
 * Usage: node scripts/e2e-smoke.mjs
 */
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function checkUrl(url) {
  const res = await fetch(url, { redirect: "manual" });
  return { url, status: res.status };
}

async function main() {
  const results = [];
  for (const url of [
    "http://localhost:3000/",
    "http://localhost:3000/login",
    "http://localhost:3000/admin",
    "http://localhost:3001/",
    "http://localhost:3001/donate",
    "http://localhost:3001/admin",
  ]) {
    try {
      results.push(await checkUrl(url));
    } catch (err) {
      results.push({ url, status: "DOWN", error: String(err.message || err) });
    }
  }

  console.log("HTTP smoke:");
  for (const r of results) {
    console.log(`  ${r.status} ${r.url}${r.error ? ` (${r.error})` : ""}`);
  }

  // Expect public 200, admin redirects (3xx)
  const schoolHome = results.find((r) => r.url.endsWith(":3000/"));
  const schoolAdmin = results.find((r) => r.url.includes(":3000/admin"));
  const ngoHome = results.find((r) => r.url.endsWith(":3001/"));

  let failed = false;
  if (schoolHome?.status !== 200) failed = true;
  if (ngoHome?.status !== 200) failed = true;
  if (typeof schoolAdmin?.status === "number" && schoolAdmin.status < 300) {
    console.warn("  warn: /admin did not redirect (expected 3xx when logged out)");
  }

  // Optional Prisma seed presence check for school
  try {
    process.chdir(path.join(root, "apps/school"));
    const { PrismaClient } = require("@prisma/client");
    const db = new PrismaClient();
    const admins = await db.user.count({ where: { role: "HEAD_ADMIN" } });
    console.log(`School HEAD_ADMIN count: ${admins}`);
    if (admins < 1) failed = true;
    await db.$disconnect();
  } catch (err) {
    console.log(`School DB check skipped/failed: ${err.message}`);
    failed = true;
  }

  if (failed) {
    console.error("\nSmoke checks failed. Ensure Postgres is configured and apps are running.");
    process.exit(1);
  }
  console.log("\nSmoke checks passed.");
}

main();
