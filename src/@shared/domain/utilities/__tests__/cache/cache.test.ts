import { Cache } from '../../cache/cache';
import { MemoryStorage } from '../../cache/storage/storage';

// Mock the storage classes
jest.mock('../../cache/storage/storage', () => ({
  MemoryStorage: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    ensure: jest.fn(),
  })),
  LocalStorageStorage: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    ensure: jest.fn(),
  })),
}));

describe('Cache', () => {
  let cache: Cache;
  let mockStorage: jest.Mocked<MemoryStorage>;

  beforeEach(() => {
    cache = new Cache();
    mockStorage = new MemoryStorage() as jest.Mocked<MemoryStorage>;
    jest.clearAllMocks();
  });

  describe('builder', () => {
    it('should return a new CacheBuilder instance', () => {
      const builder1 = cache.create;
      const builder2 = cache.create;

      expect(builder1).toBeDefined();
      expect(builder2).toBeDefined();
      expect(builder1).not.toBe(builder2); // Should be different instances
    });
  });

  describe('for', () => {
    it('should execute function when cache miss', async () => {
      const mockFn = jest.fn().mockResolvedValue('fresh data');
      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'fresh data', timestamp: Date.now() });

      const result = await cache.for(mockFn, { storage: mockStorage });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).toHaveBeenCalledWith(mockFn.name, expect.objectContaining({ data: 'fresh data' }));
      expect(result).toBe('fresh data');
    });

    it('should return cached data when cache hit', async () => {
      const mockFn = jest.fn().mockResolvedValue('fresh data');
      const cachedData = { data: 'cached data', timestamp: Date.now() };

      mockStorage.ensure.mockReturnValue(true);
      mockStorage.get.mockReturnValue(cachedData);

      const result = await cache.for(mockFn, { storage: mockStorage });

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBe('cached data');
    });

    it('should force refresh when forceRefresh is true', async () => {
      const mockFn = jest.fn().mockResolvedValue('refreshed data');
      mockStorage.get.mockReturnValue({ data: 'refreshed data', timestamp: Date.now() });

      const result = await cache.for(mockFn, { storage: mockStorage, forceRefresh: true });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).toHaveBeenCalled();
      expect(result).toBe('refreshed data');
    });

    it('should use function name as default key', async () => {
      const namedFunction = async function testFunction() {
        return 'test result';
      };

      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'test result', timestamp: Date.now() });

      await cache.for(namedFunction, { storage: mockStorage });

      expect(mockStorage.set).toHaveBeenCalledWith('testFunction', expect.any(Object));
    });

    it('should use custom key when provided', async () => {
      const mockFn = jest.fn().mockResolvedValue('custom key result');
      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'custom key result', timestamp: Date.now() });

      await cache.for(mockFn, {
        storage: mockStorage,
        key: 'custom-cache-key',
      });

      expect(mockStorage.set).toHaveBeenCalledWith('custom-cache-key', expect.any(Object));
    });

    it('should pass ttl to storage when setting data', async () => {
      const mockFn = jest.fn().mockResolvedValue('ttl test');
      const ttl = 60000;

      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'ttl test', timestamp: Date.now() });

      await cache.for(mockFn, {
        storage: mockStorage,
        ttl,
      });

      expect(mockStorage.set).toHaveBeenCalledWith(
        mockFn.name,
        expect.objectContaining({
          data: 'ttl test',
          ttl: ttl,
        })
      );
    });

    it('should handle async functions correctly', async () => {
      const asyncFn = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'async result';
      });

      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'async result', timestamp: Date.now() });

      const result = await cache.for(asyncFn, { storage: mockStorage });

      expect(result).toBe('async result');
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it('should handle function errors gracefully', async () => {
      const errorFn = jest.fn().mockRejectedValue(new Error('Function error'));
      mockStorage.ensure.mockReturnValue(false);

      await expect(cache.for(errorFn, { storage: mockStorage })).rejects.toThrow('Function error');

      expect(errorFn).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });
  });

  describe('integration with builder', () => {
    it('should merge builder options with method options', async () => {
      const mockFn = jest.fn().mockResolvedValue('merged options');
      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({ data: 'merged options', timestamp: Date.now() });

      // Mock the builder to return specific options
      const builderSpy = jest.spyOn(cache, 'builder', 'get').mockReturnValue({
        options: { ttl: 30000, storage: mockStorage },
      } as any);

      await cache.for(mockFn, { key: 'override-key' });

      expect(mockStorage.set).toHaveBeenCalledWith(
        'override-key',
        expect.objectContaining({
          data: 'merged options',
          ttl: 30000,
        })
      );

      builderSpy.mockRestore();
    });
  });

  describe('type safety', () => {
    it('should maintain type safety for return values', async () => {
      interface TestData {
        id: number;
        name: string;
      }

      const mockFn = jest.fn().mockResolvedValue({ id: 1, name: 'test' });
      mockStorage.ensure.mockReturnValue(false);
      mockStorage.get.mockReturnValue({
        data: { id: 1, name: 'test' },
        timestamp: Date.now(),
      });

      const result: TestData = await cache.for(mockFn, { storage: mockStorage });

      expect(result.id).toBe(1);
      expect(result.name).toBe('test');
    });
  });
});
