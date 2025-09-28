import { Price, PricePrimitives } from '../vo/price';

describe('Price', () => {
  const validPricePrimitives: PricePrimitives = {
    value: 10,
    currency: 'USD',
  };

  describe('Creation', () => {
    it('should create a valid price instance', () => {
      const price = Price.from(validPricePrimitives);
      expect(price).toBeDefined();
      expect(price.value).toBe(validPricePrimitives.value);
      expect(price.currency).toBe(validPricePrimitives.currency);
    });

    it('should create price with different currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'Bs', '$'];

      currencies.forEach((currency) => {
        const price = Price.from({ value: 100, currency });
        expect(price.currency).toBe(currency);
      });
    });

    it('should create price with decimal values', () => {
      const price = Price.from({ value: 99.99, currency: 'USD' });
      expect(price.value).toBe(99.99);
    });
  });

  describe('Validation', () => {
    it('should throw error for negative values', () => {
      expect(() => Price.from({ value: -1, currency: 'USD' })).toThrow();
      expect(() => Price.from({ value: -100, currency: 'USD' })).toThrow();
    });

    it('should throw error for zero value', () => {
      expect(() => Price.from({ value: 0, currency: 'USD' })).toThrow();
    });

    it('should throw error for empty currency', () => {
      expect(() => Price.from({ value: 10, currency: '' })).toThrow();
    });

    it('should throw error for whitespace-only currency', () => {
      expect(() => Price.from({ value: 10, currency: '   ' })).toThrow();
    });
  });

  describe('Comparison', () => {
    it('should correctly compare equal values', () => {
      const price = Price.from({ value: 50, currency: 'USD' });
      expect(price.is.equal(50)).toBe(true);
      expect(price.is.equal(49)).toBe(false);
      expect(price.is.equal(51)).toBe(false);
    });

    it('should handle decimal comparisons', () => {
      const price = Price.from({ value: 99.99, currency: 'USD' });
      expect(price.is.equal(99.99)).toBe(true);
      expect(price.is.equal(99.98)).toBe(false);
    });
  });

  describe('String Representation', () => {
    it('should convert to string correctly', () => {
      const price = Price.from({ value: 10, currency: 'USD' });
      expect(price.toString()).toBe('10 USD');
    });

    it('should handle decimal values in string representation', () => {
      const price = Price.from({ value: 99.99, currency: 'EUR' });
      expect(price.toString()).toBe('99.99 EUR');
    });

    it('should handle different currencies in string representation', () => {
      const testCases = [
        { value: 50, currency: 'USD', expected: '50 USD' },
        { value: 25.5, currency: 'EUR', expected: '25.5 EUR' },
        { value: 100, currency: 'Bs', expected: '100 Bs' },
        { value: 1000, currency: '$', expected: '1000 $' },
      ];

      testCases.forEach(({ value, currency, expected }) => {
        const price = Price.from({ value, currency });
        expect(price.toString()).toBe(expected);
      });
    });
  });

  describe('Serialization', () => {
    it('should serialize to primitives correctly', () => {
      const price = Price.from(validPricePrimitives);
      const primitives = price.toPrimitives();

      expect(primitives).toEqual(validPricePrimitives);
      expect(primitives.value).toBe(validPricePrimitives.value);
      expect(primitives.currency).toBe(validPricePrimitives.currency);
    });

    it('should be reversible with toPrimitives and from', () => {
      const originalPrice = Price.from({ value: 123.45, currency: 'EUR' });
      const primitives = originalPrice.toPrimitives();
      const deserializedPrice = Price.from(primitives);

      expect(deserializedPrice.value).toBe(originalPrice.value);
      expect(deserializedPrice.currency).toBe(originalPrice.currency);
      expect(deserializedPrice.is.equal(originalPrice.value)).toBe(true);
    });
  });
});
