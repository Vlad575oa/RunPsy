type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false };
  }

  entry.count += 1;
  return { allowed: true };
}
