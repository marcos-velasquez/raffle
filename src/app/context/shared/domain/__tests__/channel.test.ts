import { ChannelBuilder } from './builders/channel.builder.test';
import { ChannelMother } from './builders/channel.mother.test';

describe('Channel', () => {
  describe('create', () => {
    it('should create a channel with valid data', () => {
      const channel = ChannelMother.usd();

      expect(channel.currency).toBe('USD');
      expect(channel.details).toBe('US Bank account: 123456789');
    });

    it('should throw error when currency is empty', () => {
      expect(() => {
        new ChannelBuilder().withCurrency('').withPaymentDetails('Bank account: 123456789').build();
      }).toThrow('Currency is required');
    });

    it('should throw error when details is empty', () => {
      expect(() => {
        new ChannelBuilder().withCurrency('USD').withPaymentDetails('').build();
      }).toThrow('Payment details are required');
    });
  });

  describe('from', () => {
    it('should create channel from standard primitives', () => {
      const channel = ChannelMother.cop();

      expect(channel.getId()).toBeDefined();
      expect(channel.currency).toBe('COP');
      expect(channel.details).toBe('Nequi: 3001234567');
      expect(channel.image).toBe('https://example.com/cop.jpg');
    });

    it('should create channel with custom id', () => {
      const customId = 'custom-test-id';
      const channel = ChannelMother.withId(customId);

      expect(channel.getId()).toBe(customId);
      expect(channel.currency).toBe('USD'); // default from builder
    });
  });

  describe('toPrimitives', () => {
    it('should convert channel to primitives', () => {
      const testId = 'test-id';
      const details = 'PayPal: test@example.com';
      const channel = new ChannelBuilder().withId(testId).withCurrency('USD').withPaymentDetails(details).build();

      const primitives = channel.toPrimitives();

      expect(primitives).toEqual({
        id: testId,
        currency: 'USD',
        details: details,
        image: 'https://example.com/image.jpg',
      });
    });
  });

  describe('is.equal', () => {
    it('should check currency equality', () => {
      const channel = ChannelMother.usd();

      expect(channel.is.equal.currency('USD')).toBe(true);
      expect(channel.is.equal.currency('EUR')).toBe(false);
    });

    it('should check details equality', () => {
      const details = 'Custom payment details';
      const channel = ChannelMother.withPaymentDetails(details);

      expect(channel.details).toBe(details);
    });

    it('should check image value', () => {
      const imageUrl = 'https://example.com/custom-image.jpg';
      const channel = ChannelMother.withImage(imageUrl);

      expect(channel.image).toBe(imageUrl);
    });
  });

  describe('split', () => {
    it('should split payment details by comma', () => {
      const details = 'Bank account: 123456789,PayPal: test@example.com,Nequi: 3001234567';
      const channel = ChannelMother.withPaymentDetails(details);

      const splitDetails = channel.split.details;

      expect(splitDetails).toEqual(['Bank account: 123456789', 'PayPal: test@example.com', 'Nequi: 3001234567']);
    });

    it('should return single item when no comma separator', () => {
      const details = 'Single payment method';
      const channel = ChannelMother.withPaymentDetails(details);

      const splitDetails = channel.split.details;

      expect(splitDetails).toEqual(['Single payment method']);
    });

    it('should handle payment details with multiple commas', () => {
      const details = 'Method 1,Method 2,Method 3,Method 4';
      const channel = ChannelMother.withPaymentDetails(details);

      const splitDetails = channel.split.details;

      expect(splitDetails).toEqual(['Method 1', 'Method 2', 'Method 3', 'Method 4']);
    });
  });

  describe('different currency channels', () => {
    it('should create different currency channels', () => {
      const usdConfig = ChannelMother.usd();
      const euroConfig = ChannelMother.euro();
      const copConfig = ChannelMother.cop();

      expect(usdConfig.currency).toBe('USD');
      expect(usdConfig.image).toBe('https://example.com/usd.jpg');

      expect(euroConfig.currency).toBe('EUR');
      expect(euroConfig.image).toBe('https://example.com/eur.jpg');

      expect(copConfig.currency).toBe('COP');
      expect(copConfig.image).toBe('https://example.com/cop.jpg');
    });

    it('should create random channels', () => {
      const channel1 = ChannelMother.random();
      const channel2 = ChannelMother.random();

      expect(channel1.getId()).not.toBe(channel2.getId());
      expect(channel1.currency).toBeDefined();
      expect(channel2.currency).toBeDefined();
    });
  });
});
