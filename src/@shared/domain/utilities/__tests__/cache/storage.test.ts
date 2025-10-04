import { Storage, CacheEntry } from '../../cache/storage/storage';

// Mock implementation para testing
class MockStorage extends Storage {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): CacheEntry<T> | null {
    return (this.store.get(key) as CacheEntry<T>) || null;
  }

  set<T>(key: string, value: Omit<CacheEntry<T>, 'timestamp'>): Storage {
    this.store.set(key, { ...value, timestamp: Date.now() });
    return this;
  }

  remove(key: string): Storage {
    this.store.delete(key);
    return this;
  }
}

describe('Storage', () => {
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    jest.clearAllMocks();
  });

  describe('ensure', () => {
    it('should return true for valid non-expired entry', () => {
      const data = { message: 'test' };
      storage.set('test-key', { data, ttl: 60000 });

      expect(storage.ensure('test-key')).toBe(true);
    });

    it('should return false for expired entry', () => {
      const data = { message: 'test' };
      storage.set('test-key', { data, ttl: -1 }); // Already expired

      expect(storage.ensure('test-key')).toBe(false);
    });

    it('should return false for non-existent entry', () => {
      expect(storage.ensure('non-existent')).toBe(false);
    });

    it('should return true for entry without ttl', () => {
      const data = { message: 'test' };
      storage.set('test-key', { data });

      expect(storage.ensure('test-key')).toBe(true);
    });
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const data = { message: 'hello world' };
      storage.set('test', { data });

      const result = storage.get('test');
      expect(result?.data).toEqual(data);
      expect(result?.timestamp).toBeCloseTo(Date.now(), -2);
    });

    it('should return storage instance for chaining', () => {
      const result = storage.set('test', { data: 'value' });
      expect(result).toBe(storage);
    });
  });

  describe('remove', () => {
    it('should remove entry and return storage for chaining', () => {
      storage.set('test', { data: 'value' });
      expect(storage.get('test')).toBeTruthy();

      const result = storage.remove('test');
      expect(result).toBe(storage);
      expect(storage.get('test')).toBeNull();
    });
  });
});
