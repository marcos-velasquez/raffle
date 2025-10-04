import { Channel, ConfigurationPrimitives } from '../../channel';

export class ConfigurationBuilder {
  protected readonly primitives: ConfigurationPrimitives = {
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

  public buildPrimitives(): ConfigurationPrimitives {
    return { ...this.primitives };
  }

  public static random(): ConfigurationBuilder {
    const randomId = Math.random().toString(36).substring(7);
    const currencies = ['USD', 'EUR', 'COP', 'MXN', 'ARS'];
    const prefixes = ['+1', '+57', '+34', '+52', '+54'];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    return new ConfigurationBuilder()
      .withId(`config-${randomId}`)
      .withCurrency(randomCurrency)
      .withPaymentDetails(`Payment details for ${randomCurrency} - ${randomId}`);
  }

  public static minimal(): ConfigurationBuilder {
    return new ConfigurationBuilder().withMinimalData();
  }

  public static withCurrency(currency: string): ConfigurationBuilder {
    return new ConfigurationBuilder().withCurrency(currency);
  }

  public static withImage(image: string): ConfigurationBuilder {
    return new ConfigurationBuilder().withImage(image);
  }

  public static usd(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('USD')
      .withPaymentDetails('US Bank account: 123456789')
      .withImage('https://example.com/usd.jpg');
  }

  public static euro(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('EUR')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/eur.jpg');
  }

  public static cop(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('COP')
      .withPaymentDetails('Nequi: 3001234567')
      .withImage('https://example.com/cop.jpg');
  }
}

describe('ConfigurationBuilder util', () => {
  it('should build a channel with default values', () => {
    const channel = new ConfigurationBuilder().build();
    expect(channel.currency).toBe('USD');
    expect(channel.details).toBe('Bank account: 123456789');
    expect(channel.image).toBe('https://example.com/image.jpg');
  });

  it('should build a channel with custom values', () => {
    const channel = new ConfigurationBuilder()
      .withCurrency('EUR')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/custom.jpg')
      .build();

    expect(channel.currency).toBe('EUR');
    expect(channel.details).toBe('IBAN: ES123456789');
    expect(channel.image).toBe('https://example.com/custom.jpg');
  });

  it('should create random configurations', () => {
    const config1 = ConfigurationBuilder.random().build();
    const config2 = ConfigurationBuilder.random().build();

    expect(config1.getId()).not.toBe(config2.getId());
  });

  it('should create predefined currency configurations', () => {
    const usdConfig = ConfigurationBuilder.usd().build();
    const euroConfig = ConfigurationBuilder.euro().build();
    const copConfig = ConfigurationBuilder.cop().build();

    expect(usdConfig.currency).toBe('USD');
    expect(usdConfig.image).toBe('https://example.com/usd.jpg');

    expect(euroConfig.currency).toBe('EUR');
    expect(euroConfig.image).toBe('https://example.com/eur.jpg');

    expect(copConfig.currency).toBe('COP');
    expect(copConfig.image).toBe('https://example.com/cop.jpg');
  });
});
