import { Currency, Price, PricePrimitives } from '../vo/price';

describe('Price', () => {
  const validPricePrimitives: PricePrimitives = { value: 10, currency: 'usd' };

  describe('Creation', () => {
    it('should create a valid price instance', () => {
      const price = Price.from(validPricePrimitives);
      expect(price).toBeDefined();
      expect(price.value).toBe(validPricePrimitives.value);
      expect(price.currency).toBe(validPricePrimitives.currency);
    });

    it('should create price with different currencies', () => {
      const currencies = Price.currencies;

      currencies.forEach((currency) => {
        const price = Price.from({ value: 100, currency });
        expect(price.currency).toBe(currency);
      });
    });

    it('should create price with decimal values', () => {
      const price = Price.from({ value: 99.99, currency: 'usd' });
      expect(price.value).toBe(99.99);
    });
  });

  describe('Validation', () => {
    it('should throw error for negative values', () => {
      expect(() => Price.from({ value: -1, currency: 'usd' })).toThrow();
      expect(() => Price.from({ value: -100, currency: 'usd' })).toThrow();
    });

    it('should throw error for zero value', () => {
      expect(() => Price.from({ value: 0, currency: 'usd' })).toThrow();
    });

    it('should throw error for empty currency', () => {
      expect(() => Price.from({ value: 10, currency: '' as Currency })).toThrow();
    });

    it('should throw error for whitespace-only currency', () => {
      expect(() => Price.from({ value: 10, currency: '   ' as Currency })).toThrow();
    });
  });

  describe('Comparison', () => {
    it('should correctly compare equal values', () => {
      const price = Price.from({ value: 50, currency: 'usd' });
      expect(price.is.equal(50)).toBe(true);
      expect(price.is.equal(49)).toBe(false);
      expect(price.is.equal(51)).toBe(false);
    });

    it('should handle decimal comparisons', () => {
      const price = Price.from({ value: 99.99, currency: 'usd' });
      expect(price.is.equal(99.99)).toBe(true);
      expect(price.is.equal(99.98)).toBe(false);
    });
  });

  describe('String Representation', () => {
    it('should convert to string correctly', () => {
      const price = Price.from({ value: 10, currency: 'usd' });
      expect(price.toString()).toBe('10 usd');
    });

    it('should handle decimal values in string representation', () => {
      const price = Price.from({ value: 99.99, currency: 'eur' });
      expect(price.toString()).toBe('99.99 eur');
    });
  });
});
