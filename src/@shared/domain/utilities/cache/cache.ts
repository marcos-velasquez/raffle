import { CacheBuilder, CacheOptions } from './cache-builder';

export class Cache {
  public get create() {
    return new CacheBuilder();
  }

  public async for<T>(fn: (...args: unknown[]) => Promise<T>, options?: Partial<CacheOptions>): Promise<T> {
    const { key, storage, forceRefresh, ttl } = { key: fn.name, ...this.create.options, ...options };

    if (!forceRefresh && storage.ensure(key)) {
      return storage.get<T>(key).data;
    } else {
      return storage.set(key, { data: await fn(), ttl }).get<T>(key).data;
    }
  }
}

export const cache = new Cache();
