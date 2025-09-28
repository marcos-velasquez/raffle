import { ConfigurationBuilder } from './builders/configuration.builder.test';
import { ConfigurationMother } from './builders/configuration.mother.test';

describe('Configuration', () => {
  describe('create', () => {
    it('should create a configuration with valid data', () => {
      const configuration = ConfigurationMother.usd();

      expect(configuration.currency).toBe('USD');
      expect(configuration.phonePrefix).toBe('+1');
      expect(configuration.paymentDetails).toBe('US Bank account: 123456789');
    });

    it('should throw error when currency is empty', () => {
      expect(() => {
        new ConfigurationBuilder()
          .withCurrency('')
          .withPhonePrefix('+1')
          .withPaymentDetails('Bank account: 123456789')
          .build();
      }).toThrow('Currency is required');
    });

    it('should throw error when phonePrefix is empty', () => {
      expect(() => {
        new ConfigurationBuilder()
          .withCurrency('USD')
          .withPhonePrefix('')
          .withPaymentDetails('Bank account: 123456789')
          .build();
      }).toThrow('Phone prefix is required');
    });

    it('should throw error when paymentDetails is empty', () => {
      expect(() => {
        new ConfigurationBuilder().withCurrency('USD').withPhonePrefix('+1').withPaymentDetails('').build();
      }).toThrow('Payment details are required');
    });
  });

  describe('from', () => {
    it('should create configuration from standard primitives', () => {
      const configuration = ConfigurationMother.cop();

      expect(configuration.getId()).toBeDefined();
      expect(configuration.currency).toBe('COP');
      expect(configuration.phonePrefix).toBe('+57');
      expect(configuration.paymentDetails).toBe('Nequi: 3001234567');
      expect(configuration.image).toBe('https://example.com/cop.jpg');
    });

    it('should create configuration with custom id', () => {
      const customId = 'custom-test-id';
      const configuration = ConfigurationMother.withId(customId);

      expect(configuration.getId()).toBe(customId);
      expect(configuration.currency).toBe('USD'); // default from builder
    });
  });

  describe('toPrimitives', () => {
    it('should convert configuration to primitives', () => {
      const testId = 'test-id';
      const paymentDetails = 'PayPal: test@example.com';
      const configuration = new ConfigurationBuilder()
        .withId(testId)
        .withCurrency('USD')
        .withPhonePrefix('+1')
        .withPaymentDetails(paymentDetails)
        .build();

      const primitives = configuration.toPrimitives();

      expect(primitives).toEqual({
        id: testId,
        currency: 'USD',
        phonePrefix: '+1',
        paymentDetails: paymentDetails,
        image: 'https://example.com/image.jpg',
      });
    });
  });

  describe('is.equal', () => {
    it('should check currency equality', () => {
      const configuration = ConfigurationMother.usd();

      expect(configuration.is.equal.currency('USD')).toBe(true);
      expect(configuration.is.equal.currency('EUR')).toBe(false);
    });

    it('should check phonePrefix equality', () => {
      const configuration = ConfigurationMother.usd();

      expect(configuration.is.equal.phonePrefix('+1')).toBe(true);
      expect(configuration.is.equal.phonePrefix('+57')).toBe(false);
    });

    it('should check paymentDetails equality', () => {
      const paymentDetails = 'Custom payment details';
      const configuration = ConfigurationMother.withPaymentDetails(paymentDetails);

      expect(configuration.paymentDetails).toBe(paymentDetails);
    });

    it('should check image value', () => {
      const imageUrl = 'https://example.com/custom-image.jpg';
      const configuration = ConfigurationMother.withImage(imageUrl);

      expect(configuration.image).toBe(imageUrl);
    });
  });

  describe('split', () => {
    it('should split payment details by comma', () => {
      const paymentDetails = 'Bank account: 123456789,PayPal: test@example.com,Nequi: 3001234567';
      const configuration = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = configuration.split.paymentDetails;

      expect(splitDetails).toEqual(['Bank account: 123456789', 'PayPal: test@example.com', 'Nequi: 3001234567']);
    });

    it('should return single item when no comma separator', () => {
      const paymentDetails = 'Single payment method';
      const configuration = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = configuration.split.paymentDetails;

      expect(splitDetails).toEqual(['Single payment method']);
    });

    it('should handle payment details with multiple commas', () => {
      const paymentDetails = 'Method 1,Method 2,Method 3,Method 4';
      const configuration = ConfigurationMother.withPaymentDetails(paymentDetails);

      const splitDetails = configuration.split.paymentDetails;

      expect(splitDetails).toEqual(['Method 1', 'Method 2', 'Method 3', 'Method 4']);
    });
  });

  describe('different currency configurations', () => {
    it('should create different currency configurations', () => {
      const usdConfig = ConfigurationMother.usd();
      const euroConfig = ConfigurationMother.euro();
      const copConfig = ConfigurationMother.cop();

      expect(usdConfig.currency).toBe('USD');
      expect(usdConfig.phonePrefix).toBe('+1');
      expect(usdConfig.image).toBe('https://example.com/usd.jpg');

      expect(euroConfig.currency).toBe('EUR');
      expect(euroConfig.phonePrefix).toBe('+34');
      expect(euroConfig.image).toBe('https://example.com/eur.jpg');

      expect(copConfig.currency).toBe('COP');
      expect(copConfig.phonePrefix).toBe('+57');
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
