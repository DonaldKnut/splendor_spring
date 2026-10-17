import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateTemporaryPassword(length = 14) {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateResetToken() {
  return randomBytes(32).toString("hex");
}
