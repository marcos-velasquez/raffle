import { ConfigurationBuilder } from './builders/channel.builder.test';
import { ConfigurationMother } from './builders/channel.mother.test';

describe('Channel', () => {
  describe('create', () => {
    it('should create a channel with valid data', () => {
      const channel = ConfigurationMother.usd();

      expect(channel.currency).toBe('USD');
      expect(channel.paymentDetails).toBe('US Bank account: 123456789');
    });

    it('should throw error when currency is empty', () => {
      expect(() => {
        new ConfigurationBuilder().withCurrency('').withPaymentDetails('Bank account: 123456789').build();
      }).toThrow('Currency is required');
    });

    it('should throw error when paymentDetails is empty', () => {
      expect(() => {
        new ConfigurationBuilder().withCurrency('USD').withPaymentDetails('').build();
      }).toThrow('Payment details are required');
    });
  });

  describe('from', () => {
    it('should create channel from standard primitives', () => {
      const channel = ConfigurationMother.cop();

      expect(channel.getId()).toBeDefined();
      expect(channel.currency).toBe('COP');
      expect(channel.paymentDetails).toBe('Nequi: 3001234567');
      expect(channel.image).toBe('https://example.com/cop.jpg');
    });

    it('should create channel with custom id', () => {
      const customId = 'custom-test-id';
      const channel = ConfigurationMother.withId(customId);

      expect(channel.getId()).toBe(customId);
      expect(channel.currency).toBe('USD'); // default from builder
    });
  });

  describe('toPrimitives', () => {
    it('should convert channel to primitives', () => {
      const testId = 'test-id';
      const paymentDetails = 'PayPal: test@example.com';
      const channel = new ConfigurationBuilder()
        .withId(testId)
        .withCurrency('USD')
        .withPaymentDetails(paymentDetails)
        .build();

      const primitives = channel.toPrimitives();

      expect(primitives).toEqual({
        id: testId,
        currency: 'USD',
        paymentDetails: paymentDetails,
        image: 'https://example.com/image.jpg',
      });
    });
  });

  describe('is.equal', () => {
    it('should check currency equality', () => {
      const channel = ConfigurationMother.usd();

      expect(channel.is.equal.currency('USD')).toBe(true);
      expect(channel.is.equal.currency('EUR')).toBe(false);
    });

    it('should check paymentDetails equality', () => {
      const paymentDetails = 'Custom payment details';
      const channel = ConfigurationMother.withPaymentDetails(paymentDetails);

      expect(channel.paymentDetails).toBe(paymentDetails);
    });

    it('should check image value', () => {
      const imageUrl = 'https://example.com/custom-image.jpg';
      const channel = ConfigurationMother.withImage(imageUrl);

      expect(channel.image).toBe(imageUrl);
    });
  });

  describe('split', () => {
    it('should split payment details by comma', () => {
      const paymentDetails = 'Bank account: 123456789,PayPal: test@example.com,Nequi: 3001234567';
      const channel = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = channel.split.paymentDetails;

      expect(splitDetails).toEqual(['Bank account: 123456789', 'PayPal: test@example.com', 'Nequi: 3001234567']);
    });

    it('should return single item when no comma separator', () => {
      const paymentDetails = 'Single payment method';
      const channel = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = channel.split.paymentDetails;

      expect(splitDetails).toEqual(['Single payment method']);
    });

    it('should handle payment details with multiple commas', () => {
      const paymentDetails = 'Method 1,Method 2,Method 3,Method 4';
      const channel = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = channel.split.paymentDetails;

      expect(splitDetails).toEqual(['Method 1', 'Method 2', 'Method 3', 'Method 4']);
    });
  });

  describe('different currency configurations', () => {
    it('should create different currency configurations', () => {
      const usdConfig = ConfigurationMother.usd();
      const euroConfig = ConfigurationMother.euro();
      const copConfig = ConfigurationMother.cop();

      expect(usdConfig.currency).toBe('USD');
      expect(usdConfig.image).toBe('https://example.com/usd.jpg');

      expect(euroConfig.currency).toBe('EUR');
      expect(euroConfig.image).toBe('https://example.com/eur.jpg');

      expect(copConfig.currency).toBe('COP');
      expect(copConfig.image).toBe('https://example.com/cop.jpg');
    });

    it('should create random configurations', () => {
      const config1 = ConfigurationMother.random();
      const config2 = ConfigurationMother.random();

      expect(config1.getId()).not.toBe(config2.getId());
      expect(config1.currency).toBeDefined();
      expect(config2.currency).toBeDefined();
    });
  });
});
