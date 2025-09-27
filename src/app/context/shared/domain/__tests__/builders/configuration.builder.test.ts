import { Configuration, ConfigurationPrimitives } from '../../configuration';

export class ConfigurationBuilder {
  protected readonly primitives: ConfigurationPrimitives = {
    id: 'test-configuration-id',
    currency: 'USD',
    phonePrefix: '+1',
    paymentDetails: 'Bank account: 123456789',
  };

  public withId(id: string): this {
    this.primitives.id = id;
    return this;
  }

  public withCurrency(currency: string): this {
    this.primitives.currency = currency;
    return this;
  }

  public withPhonePrefix(phonePrefix: string): this {
    this.primitives.phonePrefix = phonePrefix;
    return this;
  }

  public withPaymentDetails(paymentDetails: string): this {
    this.primitives.paymentDetails = paymentDetails;
    return this;
  }

  public withMinimalData(): this {
    this.primitives.currency = 'USD';
    this.primitives.phonePrefix = '+1';
    this.primitives.paymentDetails = 'Min payment details';
    return this;
  }

  public withEmptyFields(): this {
    this.primitives.currency = '';
    this.primitives.phonePrefix = '';
    this.primitives.paymentDetails = '';
    return this;
  }

  public build(): Configuration {
    return Configuration.from(this.primitives);
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
      .withPhonePrefix(randomPrefix)
      .withPaymentDetails(`Payment details for ${randomCurrency} - ${randomId}`);
  }

  public static minimal(): ConfigurationBuilder {
    return new ConfigurationBuilder().withMinimalData();
  }

  public static withCurrency(currency: string): ConfigurationBuilder {
    return new ConfigurationBuilder().withCurrency(currency);
  }

  public static withPhonePrefix(phonePrefix: string): ConfigurationBuilder {
    return new ConfigurationBuilder().withPhonePrefix(phonePrefix);
  }

  public static usd(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('USD')
      .withPhonePrefix('+1')
      .withPaymentDetails('US Bank account: 123456789');
  }

  public static euro(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('EUR')
      .withPhonePrefix('+34')
      .withPaymentDetails('IBAN: ES123456789');
  }

  public static cop(): ConfigurationBuilder {
    return new ConfigurationBuilder()
      .withCurrency('COP')
      .withPhonePrefix('+57')
      .withPaymentDetails('Nequi: 3001234567');
  }
}

describe('ConfigurationBuilder util', () => {
  it('should build a configuration with default values', () => {
    const configuration = new ConfigurationBuilder().build();
    expect(configuration.currency).toBe('USD');
    expect(configuration.phonePrefix).toBe('+1');
    expect(configuration.paymentDetails).toBe('Bank account: 123456789');
  });

  it('should build a configuration with custom values', () => {
    const configuration = new ConfigurationBuilder()
      .withCurrency('EUR')
      .withPhonePrefix('+34')
      .withPaymentDetails('IBAN: ES123456789')
      .build();

    expect(configuration.currency).toBe('EUR');
    expect(configuration.phonePrefix).toBe('+34');
    expect(configuration.paymentDetails).toBe('IBAN: ES123456789');
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
    expect(usdConfig.phonePrefix).toBe('+1');

    expect(euroConfig.currency).toBe('EUR');
    expect(euroConfig.phonePrefix).toBe('+34');

    expect(copConfig.currency).toBe('COP');
    expect(copConfig.phonePrefix).toBe('+57');
  });
});
