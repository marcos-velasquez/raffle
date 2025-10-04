import { Channel, ChannelPrimitives } from '../../channel';

export class ChannelBuilder {
  protected readonly primitives: ChannelPrimitives = {
    id: 'test-channel-id',
    currency: 'USD',
    details: 'Bank account: 123456789',
    image: 'https://example.com/image.jpg',
  };

  public withId(id: string): this {
    this.primitives.id = id;
    return this;
  }

  public withCurrency(currency: string): this {
    this.primitives.currency = currency;
    return this;
  }

  public withPaymentDetails(details: string): this {
    this.primitives.details = details;
    return this;
  }

  public withImage(image: string): this {
    this.primitives.image = image;
    return this;
  }

  public withMinimalData(): this {
    this.primitives.currency = 'USD';
    this.primitives.details = 'Min payment details';
    this.primitives.image = 'https://example.com/min.jpg';
    return this;
  }

  public withEmptyFields(): this {
    this.primitives.currency = '';
    this.primitives.details = '';
    this.primitives.image = '';
    return this;
  }

  public build(): Channel {
    return Channel.from(this.primitives);
  }

  public buildPrimitives(): ChannelPrimitives {
    return { ...this.primitives };
  }

  public static random(): ChannelBuilder {
    const randomId = Math.random().toString(36).substring(7);
    const currencies = ['USD', 'EUR', 'COP', 'MXN', 'ARS'];
    const prefixes = ['+1', '+57', '+34', '+52', '+54'];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    return new ChannelBuilder()
      .withId(`config-${randomId}`)
      .withCurrency(randomCurrency)
      .withPaymentDetails(`Payment details for ${randomCurrency} - ${randomId}`);
  }

  public static minimal(): ChannelBuilder {
    return new ChannelBuilder().withMinimalData();
  }

  public static withCurrency(currency: string): ChannelBuilder {
    return new ChannelBuilder().withCurrency(currency);
  }

  public static withImage(image: string): ChannelBuilder {
    return new ChannelBuilder().withImage(image);
  }

  public static usd(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('USD')
      .withPaymentDetails('US Bank account: 123456789')
      .withImage('https://example.com/usd.jpg');
  }

  public static euro(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('EUR')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/eur.jpg');
  }

  public static cop(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('COP')
      .withPaymentDetails('Nequi: 3001234567')
      .withImage('https://example.com/cop.jpg');
  }
}

describe('ConfigurationBuilder util', () => {
  it('should build a channel with default values', () => {
    const channel = new ChannelBuilder().build();
    expect(channel.currency).toBe('USD');
    expect(channel.details).toBe('Bank account: 123456789');
    expect(channel.image).toBe('https://example.com/image.jpg');
  });

  it('should build a channel with custom values', () => {
    const channel = new ChannelBuilder()
      .withCurrency('EUR')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/custom.jpg')
      .build();

    expect(channel.currency).toBe('EUR');
    expect(channel.details).toBe('IBAN: ES123456789');
    expect(channel.image).toBe('https://example.com/custom.jpg');
  });

  it('should create random configurations', () => {
    const config1 = ChannelBuilder.random().build();
    const config2 = ChannelBuilder.random().build();

    expect(config1.getId()).not.toBe(config2.getId());
  });

  it('should create predefined currency configurations', () => {
    const usdConfig = ChannelBuilder.usd().build();
    const euroConfig = ChannelBuilder.euro().build();
    const copConfig = ChannelBuilder.cop().build();

    expect(usdConfig.currency).toBe('USD');
    expect(usdConfig.image).toBe('https://example.com/usd.jpg');

    expect(euroConfig.currency).toBe('EUR');
    expect(euroConfig.image).toBe('https://example.com/eur.jpg');

    expect(copConfig.currency).toBe('COP');
    expect(copConfig.image).toBe('https://example.com/cop.jpg');
  });
});
