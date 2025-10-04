import { MemoryStorage } from '../../cache/storage/memory';

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should return stored data', () => {
      const data = { message: 'test data' };
      storage.set('test-key', { data });

      const result = storage.get('test-key');
      expect(result?.data).toEqual(data);
    });
  });

  describe('set', () => {
    it('should store data with timestamp', () => {
      const data = { value: 42 };
      const beforeTime = Date.now();
      
      storage.set('number-key', { data });
      
      const result = storage.get('number-key');
      expect(result?.data).toEqual(data);
      expect(result?.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result?.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should store data with ttl', () => {
      const data = { test: true };
      const ttl = 5000;
      
      storage.set('ttl-key', { data, ttl });
      
      const result = storage.get('ttl-key');
      expect(result?.data).toEqual(data);
      expect(result?.ttl).toBe(ttl);
    });

    it('should return storage instance for method chaining', () => {
      const result = storage.set('chain-test', { data: 'chainable' });
      expect(result).toBe(storage);
    });

    it('should overwrite existing data', () => {
      storage.set('overwrite-test', { data: 'original' });
      storage.set('overwrite-test', { data: 'updated' });

      const result = storage.get('overwrite-test');
      expect(result?.data).toBe('updated');
    });
  });

  describe('remove', () => {
    it('should remove existing entry', () => {
      storage.set('remove-test', { data: 'to be removed' });
      expect(storage.get('remove-test')).toBeTruthy();

      storage.remove('remove-test');
      expect(storage.get('remove-test')).toBeNull();
    });

    it('should return storage instance for method chaining', () => {
      const result = storage.remove('any-key');
      expect(result).toBe(storage);
    });

    it('should handle removing non-existent key gracefully', () => {
      expect(() => storage.remove('non-existent')).not.toThrow();
    });
  });

  describe('ensure', () => {
    it('should return true for valid entry', () => {
      storage.set('valid-key', { data: 'valid data' });
      expect(storage.ensure('valid-key')).toBe(true);
    });

    it('should return false for expired entry', () => {
      storage.set('expired-key', { data: 'expired', ttl: -1 });
      expect(storage.ensure('expired-key')).toBe(false);
    });
  });

  describe('integration', () => {
    it('should handle multiple operations in sequence', () => {
      const result = storage
        .set('key1', { data: 'value1' })
        .set('key2', { data: 'value2', ttl: 1000 })
        .remove('key1');

      expect(result).toBe(storage);
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')?.data).toBe('value2');
    });
  });
});
