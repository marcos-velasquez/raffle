import { Storage, memoryStorage, localStorageStorage } from './storage';
import { cache } from './cache';

export type CacheOptions = { key: string; ttl?: number; forceRefresh?: boolean; storage?: Storage };

export class CacheBuilder {
  public readonly options: Partial<CacheOptions> = { ttl: Infinity, forceRefresh: false, storage: memoryStorage };

  public key(key: string): CacheBuilder {
    this.options.key = key;
    return this;
  }

  public ttl(milliseconds: number): CacheBuilder {
    this.options.ttl = milliseconds;
    return this;
  }

  public persistent(): CacheBuilder {
    this.options.storage = localStorageStorage;
    return this;
  }

  public refresh(): CacheBuilder {
    this.options.forceRefresh = true;
    return this;
  }

  public async for<T>(fn: () => Promise<T>): Promise<T> {
    return cache.for(fn, { key: fn.name, ...this.options });
  }
}
