import { CacheBuilder } from '../../cache/cache-builder';
import { MemoryStorage, LocalStorageStorage } from '../../cache/storage/storage';

describe('CacheBuilder', () => {
  let builder: CacheBuilder;

  beforeEach(() => {
    builder = new CacheBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      expect(builder.options.ttl).toBe(Infinity);
      expect(builder.options.forceRefresh).toBe(false);
      expect(builder.options.storage).toBeInstanceOf(MemoryStorage);
    });
  });

  describe('key', () => {
    it('should set key and return builder for chaining', () => {
      const result = builder.key('test-key');
      
      expect(result).toBe(builder);
      expect(builder.options.key).toBe('test-key');
    });

    it('should overwrite existing key', () => {
      builder.key('first-key').key('second-key');
      
      expect(builder.options.key).toBe('second-key');
    });
  });

  describe('ttl', () => {
    it('should set ttl and return builder for chaining', () => {
      const result = builder.ttl(60000);
      
      expect(result).toBe(builder);
      expect(builder.options.ttl).toBe(60000);
    });

    it('should handle zero ttl', () => {
      builder.ttl(0);
      expect(builder.options.ttl).toBe(0);
    });

    it('should handle negative ttl', () => {
      builder.ttl(-1000);
      expect(builder.options.ttl).toBe(-1000);
    });
  });

  describe('persistent', () => {
    it('should set LocalStorageStorage and return builder for chaining', () => {
      const result = builder.persistent();
      
      expect(result).toBe(builder);
      expect(builder.options.storage).toBeInstanceOf(LocalStorageStorage);
    });

    it('should replace existing storage', () => {
      builder.persistent();
      expect(builder.options.storage).toBeInstanceOf(LocalStorageStorage);
    });
  });

  describe('refresh', () => {
    it('should set forceRefresh and return builder for chaining', () => {
      const result = builder.refresh();
      
      expect(result).toBe(builder);
      expect(builder.options.forceRefresh).toBe(true);
    });
  });

  describe('for', () => {
    it('should execute function and return result', async () => {
      const mockFn = jest.fn().mockResolvedValue('test result');
      
      const result = await builder.for(mockFn);
      
      expect(result).toBe('test result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should use function name as default key', async () => {
      const namedFunction = async function testFunction() {
        return 'result';
      };
      
      const result = await builder.for(namedFunction);
      
      expect(result).toBe('result');
      // The key should be set to the function name internally
    });

    it('should handle async functions', async () => {
      const asyncFn = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async result';
      });
      
      const result = await builder.for(asyncFn);
      
      expect(result).toBe('async result');
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('method chaining', () => {
    it('should support full method chaining', async () => {
      const mockFn = jest.fn().mockResolvedValue('chained result');
      
      const result = await builder
        .key('chain-test')
        .ttl(30000)
        .persistent()
        .refresh()
        .for(mockFn);
      
      expect(result).toBe('chained result');
      expect(builder.options.key).toBe('chain-test');
      expect(builder.options.ttl).toBe(30000);
      expect(builder.options.storage).toBeInstanceOf(LocalStorageStorage);
      expect(builder.options.forceRefresh).toBe(true);
    });

    it('should allow partial chaining', async () => {
      const mockFn = jest.fn().mockResolvedValue('partial result');
      
      const result = await builder
        .key('partial-test')
        .ttl(15000)
        .for(mockFn);
      
      expect(result).toBe('partial result');
      expect(builder.options.key).toBe('partial-test');
      expect(builder.options.ttl).toBe(15000);
      expect(builder.options.storage).toBeInstanceOf(MemoryStorage); // Default
      expect(builder.options.forceRefresh).toBe(false); // Default
    });
  });

  describe('options immutability', () => {
    it('should not affect other builders when modifying options', () => {
      const builder1 = new CacheBuilder();
      const builder2 = new CacheBuilder();
      
      builder1.key('builder1-key').ttl(1000);
      builder2.key('builder2-key').ttl(2000);
      
      expect(builder1.options.key).toBe('builder1-key');
      expect(builder1.options.ttl).toBe(1000);
      expect(builder2.options.key).toBe('builder2-key');
      expect(builder2.options.ttl).toBe(2000);
    });
  });
});
