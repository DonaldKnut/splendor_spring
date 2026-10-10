import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export function toSubunit(amount: number): number {
  return Math.round(amount * 100);
}

export function fromSubunit(amount: number): number {
  return amount / 100;
}

export function createPaymentReference(prefix = "don"): string {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

export function sha512Hmac(secret: string, payload: string): string {
  return createHmac("sha512", secret).update(payload).digest("hex");
}

export function sha256(payload: string): string {
  return createHash("sha256").update(payload).digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit & { secretKey: string }
): Promise<T> {
  const { secretKey, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ||
      `Payment provider request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}
