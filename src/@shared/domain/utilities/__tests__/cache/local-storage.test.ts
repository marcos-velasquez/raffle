import { LocalStorageStorage } from '../../cache/storage/local-storage';
import { CacheEntry } from '../../cache/storage/storage';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => (store[key] = value)),
    removeItem: jest.fn((key: string) => delete store[key]),
    clear: jest.fn(() => (store = {})),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LocalStorageStorage', () => {
  let storage: LocalStorageStorage;

  beforeEach(() => {
    storage = new LocalStorageStorage();
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cache_non-existent');
    });

    it('should return parsed data from localStorage', () => {
      const data = { message: 'test data' };
      const entry = { data, timestamp: Date.now() };
      localStorageMock.setItem('cache_test-key', JSON.stringify(entry));

      const result = storage.get('test-key');
      expect(result).toEqual(entry);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.setItem('cache_invalid', 'invalid-json');

      expect(() => storage.get('invalid')).not.toThrow();
      expect(storage.get('invalid')).toBeNull();
    });
  });

  describe('set', () => {
    it('should store data in localStorage with cache prefix', () => {
      const data = { value: 42 };
      const beforeTime = Date.now();

      storage.set('number-key', { data });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('cache_number-key', expect.stringContaining('"value":42'));

      const storedCall = localStorageMock.setItem.mock.calls[0];
      const storedData = JSON.parse(storedCall[1]);
      expect(storedData.data).toEqual(data);
      expect(storedData.timestamp).toBeGreaterThanOrEqual(beforeTime);
    });

    it('should store data with ttl', () => {
      const data = { test: true };
      const ttl = 5000;

      storage.set('ttl-key', { data, ttl });

      const storedCall = localStorageMock.setItem.mock.calls[0];
      const storedData = JSON.parse(storedCall[1]);
      expect(storedData.data).toEqual(data);
      expect(storedData.ttl).toBe(ttl);
    });
  });

  describe('remove', () => {
    it('should remove item from localStorage', () => {
      storage.remove('remove-test');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cache_remove-test');
    });

    it('should return storage instance for method chaining', () => {
      const result = storage.remove('any-key');
      expect(result).toBe(storage);
    });
  });

  describe('ensure', () => {
    it('should return true for valid entry', () => {
      const entry = { data: 'valid data', timestamp: Date.now() };
      localStorageMock.setItem('cache_valid-key', JSON.stringify(entry));

      expect(storage.ensure('valid-key')).toBe(true);
    });

    it('should return false for expired entry', () => {
      const entry = { data: 'expired', timestamp: Date.now(), ttl: -1 };
      localStorageMock.setItem('cache_expired-key', JSON.stringify(entry));

      expect(storage.ensure('expired-key')).toBe(false);
    });
  });

  describe('integration', () => {
    it('should work with real localStorage operations', () => {
      const data1 = { message: 'first' };
      const data2 = { message: 'second' };

      storage.set('key1', { data: data1, ttl: 1000 }).set('key2', { data: data2, ttl: 1000 }).remove('key1');

      expect(storage.get('key1')).toBeNull();
      expect(storage.get<CacheEntry<typeof data2>>('key2')?.data).toEqual(data2);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cache_key1');
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });
  });
});
