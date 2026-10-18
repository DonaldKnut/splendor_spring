/** Run a DB query; return fallback when the database is unreachable (e.g. Vercel build). */
export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
