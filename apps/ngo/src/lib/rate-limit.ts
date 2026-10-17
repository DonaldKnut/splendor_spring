type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  max = Number(process.env.NGO_RATE_LIMIT_MAX ?? 60),
  windowMs = Number(process.env.NGO_RATE_LIMIT_WINDOW_MS ?? 60_000)
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfterMs: 0 };
  }

  if (current.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: current.resetAt - now,
    };
  }

  current.count += 1;
  return { ok: true, remaining: max - current.count, retryAfterMs: 0 };
}
