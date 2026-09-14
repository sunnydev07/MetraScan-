import { IScan } from '../../models/Scan';

interface CacheEntry {
  scan: IScan;
  expiresAt: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheEntry>();
  private defaultTtlMs = 30 * 60 * 1000; // 30 minutes

  public set(key: string, scan: IScan, ttlMs?: number): void {
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
}

export const cacheService = new CacheService();
