import { cache } from '../../cache/cache';

// Mock localStorage for integration tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Cache Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Memory Storage Integration', () => {
    it('should cache function results in memory', async () => {
      let callCount = 0;
      const expensiveFunction = async () => {
        callCount++;
        return `result-${callCount}`;
      };

      // Use the same storage instance for both calls
      const memoryStorage = new (await import('../../cache/storage/storage')).MemoryStorage();

      // First call - should execute function
      const result1 = await cache.for(expensiveFunction, {
        key: 'expensive-op',
        storage: memoryStorage,
      });

      // Second call - should return cached result
      const result2 = await cache.for(expensiveFunction, {
        key: 'expensive-op',
        storage: memoryStorage,
      });

      expect(result1).toBe('result-1');
      expect(result2).toBe('result-1'); // Same cached result
      expect(callCount).toBe(1); // Function called only once
    });

    it('should respect TTL expiration', async () => {
      let callCount = 0;
      const timedFunction = async () => {
        callCount++;
        return `timed-result-${callCount}`;
      };

      // Cache with very short TTL
      const result1 = await cache.for(timedFunction, {
        key: 'timed-op',
        ttl: 1, // 1ms TTL
      });

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should execute function again due to expiration
      const result2 = await cache.for(timedFunction, {
        key: 'timed-op',
        ttl: 1,
      });

      expect(result1).toBe('timed-result-1');
      expect(result2).toBe('timed-result-2');
      expect(callCount).toBe(2);
    });
  });

  describe('Persistent Storage Integration', () => {
    it('should persist data to localStorage', async () => {
      let callCount = 0;
      const persistentFunction = async () => {
        callCount++;
        return { data: `persistent-${callCount}`, timestamp: Date.now() };
      };

      const result = await cache.create.key('persistent-op').persistent().for(persistentFunction);

      expect(result.data).toBe('persistent-1');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cache_persistent-op',
        expect.stringContaining('persistent-1')
      );
    });

    it('should retrieve data from localStorage on subsequent calls', async () => {
      // Pre-populate localStorage
      const cachedData = {
        data: { message: 'from localStorage' },
        timestamp: Date.now(),
        ttl: 60000,
      };
      localStorageMock.setItem('cache_persistent-retrieve', JSON.stringify(cachedData));

      let callCount = 0;
      const mockFunction = async () => {
        callCount++;
        return { message: 'fresh data' };
      };

      const result = await cache.create.key('persistent-retrieve').persistent().for(mockFunction);

      expect(result.message).toBe('from localStorage');
      expect(callCount).toBe(0); // Function should not be called
    });
  });

  describe('Force Refresh Integration', () => {
    it('should bypass cache when forceRefresh is enabled', async () => {
      let callCount = 0;
      const refreshFunction = async () => {
        callCount++;
        return `refresh-${callCount}`;
      };

      // First call - populate cache
      await cache.create.key('refresh-op').for(refreshFunction);

      // Second call with forceRefresh - should bypass cache
      const result = await cache.create.key('refresh-op').refresh().for(refreshFunction);

      expect(result).toBe('refresh-2');
      expect(callCount).toBe(2);
    });
  });

  describe('Builder Pattern Integration', () => {
    it('should support complex builder chains', async () => {
      let callCount = 0;
      const complexFunction = async (prefix: string) => {
        callCount++;
        return `${prefix}-complex-${callCount}`;
      };

      const result = await cache.create
        .key('complex-operation')
        .ttl(30000)
        .persistent()
        .for(() => complexFunction('test'));

      expect(result).toBe('test-complex-1');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cache_complex-operation',
        expect.stringContaining('test-complex-1')
      );
    });

    it('should create independent builder instances', async () => {
      const fn1 = async () => 'result1';
      const fn2 = async () => 'result2';

      const builder1 = cache.create.key('op1').ttl(1000);
      const builder2 = cache.create.key('op2').ttl(2000).persistent();

      const [result1, result2] = await Promise.all([builder1.for(fn1), builder2.for(fn2)]);

      expect(result1).toBe('result1');
      expect(result2).toBe('result2');

      // Verify localStorage was only called for persistent builder
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cache_op2', expect.stringContaining('result2'));
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      const testFunction = async () => 'test data';

      // Should not throw error even if localStorage fails
      const result = await cache.for(testFunction, {
        key: 'error-test',
        storage: new (await import('../../cache/storage/storage')).LocalStorageStorage(),
      });

      expect(result).toBe('test data');
    });

    it('should handle function execution errors', async () => {
      const errorFunction = async () => {
        throw new Error('Function execution failed');
      };

      await expect(cache.create.key('error-function').for(errorFunction)).rejects.toThrow('Function execution failed');
    });
  });

  describe('Performance Integration', () => {
    it('should demonstrate performance benefits of caching', async () => {
      let callCount = 0;
      const slowFunction = async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return 'slow result';
      };

      // Use the same storage instance for both calls
      const memoryStorage = new (await import('../../cache/storage/storage')).MemoryStorage();

      // First call - should take time and execute function
      const start1 = Date.now();
      const result1 = await cache.for(slowFunction, {
        key: 'slow-op',
        storage: memoryStorage,
      });
      const duration1 = Date.now() - start1;

      // Second call - should be much faster (cached)
      const start2 = Date.now();
      const result2 = await cache.for(slowFunction, {
        key: 'slow-op',
        storage: memoryStorage,
      });
      const duration2 = Date.now() - start2;

      expect(result1).toBe('slow result');
      expect(result2).toBe('slow result');
      expect(callCount).toBe(1); // Function should only be called once
      expect(duration2).toBeLessThan(duration1); // Cached call should be faster
      expect(duration2).toBeLessThan(20); // Should be very fast
    });
  });
});
