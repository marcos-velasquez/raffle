export type CacheEntry<T> = { data: T; timestamp: number; ttl?: number };

export abstract class Storage {
  abstract get<T>(key: string): CacheEntry<T> | null;
  abstract set<T>(key: string, value: Omit<CacheEntry<T>, 'timestamp'>): Storage;
  abstract remove(key: string): Storage;

  public ensure(key: string): boolean {
    return this.get(key) && !this.isExpired(this.get(key));
  }

  private isExpired(entry: CacheEntry<unknown>) {
    return entry.ttl ? Date.now() - entry.timestamp > entry.ttl : false;
  }
}
