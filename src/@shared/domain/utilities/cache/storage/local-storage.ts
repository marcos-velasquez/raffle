import { CacheEntry, Storage } from './storage';

export class LocalStorageStorage extends Storage {
  public get<T>(key: string): CacheEntry<T> | null {
    const entry = localStorage.getItem(`cache_${key}`);
    return entry ? JSON.parse(entry) : null;
  }

  public set<T>(key: string, value: Omit<CacheEntry<T>, 'timestamp'>): Storage {
    localStorage.setItem(`cache_${key}`, JSON.stringify({ ...value, timestamp: Date.now() }));
    return this;
  }

  public remove(key: string): Storage {
    localStorage.removeItem(`cache_${key}`);
    return this;
  }
}

export const localStorageStorage = new LocalStorageStorage();
