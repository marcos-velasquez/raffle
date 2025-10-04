import { CacheEntry, Storage } from './storage';

export class MemoryStorage extends Storage {
  private readonly memory = new Map<string, CacheEntry<unknown>>();

  public get<T>(key: string): CacheEntry<T> | null {
    return (this.memory.get(key) as CacheEntry<T>) ?? null;
  }

  public set<T>(key: string, value: Omit<CacheEntry<T>, 'timestamp'>): Storage {
    this.memory.set(key, { ...value, timestamp: Date.now() });
    return this;
  }

  public remove(key: string): Storage {
    this.memory.delete(key);
    return this;
  }
}

export const memoryStorage = new MemoryStorage();
