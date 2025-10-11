import { Channel, ChannelPrimitives } from '../../channel';
import { Currency, Price } from '../../vo/price';

export class ChannelBuilder {
  protected readonly primitives: ChannelPrimitives = {
    id: 'test-channel-id',
    currency: 'usd',
    details: 'Bank account: 123456789',
    image: 'https://example.com/image.jpg',
  };

  public withId(id: string): this {
    this.primitives.id = id;
    return this;
  }

  public withCurrency(currency: Currency): this {
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
    this.primitives.currency = 'usd';
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
    const currencies = Price.currencies;
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];

    return new ChannelBuilder()
      .withId(`config-${randomId}`)
      .withCurrency(randomCurrency)
      .withPaymentDetails(`Payment details for ${randomCurrency} - ${randomId}`);
  }

  public static minimal(): ChannelBuilder {
    return new ChannelBuilder().withMinimalData();
  }

  public static withCurrency(currency: Currency): ChannelBuilder {
    return new ChannelBuilder().withCurrency(currency);
  }

  public static withImage(image: string): ChannelBuilder {
    return new ChannelBuilder().withImage(image);
  }

  public static usd(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('usd')
      .withPaymentDetails('US Bank account: 123456789')
      .withImage('https://example.com/usd.jpg');
  }

  public static euro(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('eur')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/eur.jpg');
  }

  public static cop(): ChannelBuilder {
    return new ChannelBuilder()
      .withCurrency('cop')
      .withPaymentDetails('Nequi: 3001234567')
      .withImage('https://example.com/cop.jpg');
  }
}

describe('ConfigurationBuilder util', () => {
  it('should build a channel with default values', () => {
    const channel = new ChannelBuilder().build();
    expect(channel.currency).toBe('usd');
    expect(channel.details).toBe('Bank account: 123456789');
    expect(channel.image).toBe('https://example.com/image.jpg');
  });

  it('should build a channel with custom values', () => {
    const channel = new ChannelBuilder()
      .withCurrency('eur')
      .withPaymentDetails('IBAN: ES123456789')
      .withImage('https://example.com/custom.jpg')
      .build();

    expect(channel.currency).toBe('eur');
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

    expect(usdConfig.currency).toBe('usd');
    expect(usdConfig.image).toBe('https://example.com/usd.jpg');

    expect(euroConfig.currency).toBe('eur');
    expect(euroConfig.image).toBe('https://example.com/eur.jpg');

    expect(copConfig.currency).toBe('cop');
    expect(copConfig.image).toBe('https://example.com/cop.jpg');
  });
});
