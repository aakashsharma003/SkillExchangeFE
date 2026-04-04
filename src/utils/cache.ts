/**
 * Simple in-memory TTL cache for API responses.
 *
 * Usage:
 *   const data = await withCache('dashboard-stats', fetchFn, 60_000);
 *
 * - `key`   — unique string identifier for the cached entry.
 * - `fn`    — async function that fetches the data when cache is stale.
 * - `ttlMs` — time-to-live in milliseconds (default 60 s).
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Returns cached data if still valid, otherwise calls `fn`, caches and returns
 * the result.
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs = 60_000,
): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined;

  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const data = await fn();
  store.set(key, { data, expiry: Date.now() + ttlMs });
  return data;
}

/**
 * Remove a specific entry from the cache (e.g. after a mutation).
 */
export function invalidateCache(key: string): void {
  store.delete(key);
}

/**
 * Remove all entries whose keys start with the given prefix.
 */
export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

/**
 * Clear the entire cache.
 */
export function clearCache(): void {
  store.clear();
}
