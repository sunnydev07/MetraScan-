import { IScan } from '../../models/Scan';

interface CacheEntry {
  scan: IScan;
  expiresAt: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheEntry>();
  private defaultTtlMs = 30 * 60 * 1000; // 30 minutes
  private maxEntries = 1000;

  constructor() {
    // Periodic cleanup of expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  public set(key: string, scan: IScan, ttlMs?: number): void {
    // Evict oldest entry if at capacity
    if (this.memoryCache.size >= this.maxEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    const expiresAt = Date.now() + (ttlMs || this.defaultTtlMs);
    this.memoryCache.set(key, { scan, expiresAt });
  }

  public get(key: string): IScan | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.scan;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): void {
    this.memoryCache.delete(key);
  }

  public clear(): void {
    this.memoryCache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache) {
      if (now > entry.expiresAt) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService();
