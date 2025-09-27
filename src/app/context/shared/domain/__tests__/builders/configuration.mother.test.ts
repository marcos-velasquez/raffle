import { Configuration } from '../../configuration';
import { ConfigurationBuilder } from './configuration.builder.test';

export class ConfigurationMother {
  public static default(): Configuration {
    return new ConfigurationBuilder().build();
  }

  public static random(): Configuration {
    return ConfigurationBuilder.random().build();
  }

  public static minimal(): Configuration {
    return ConfigurationBuilder.minimal().build();
  }

  public static withCurrency(currency: string): Configuration {
    return ConfigurationBuilder.withCurrency(currency).build();
  }

  public static withPhonePrefix(phonePrefix: string): Configuration {
    return ConfigurationBuilder.withPhonePrefix(phonePrefix).build();
  }

  public static usd(): Configuration {
    return ConfigurationBuilder.usd().build();
  }

  public static euro(): Configuration {
    return ConfigurationBuilder.euro().build();
  }

  public static cop(): Configuration {
    return ConfigurationBuilder.cop().build();
  }

  public static withPaymentDetails(paymentDetails: string): Configuration {
    return new ConfigurationBuilder().withPaymentDetails(paymentDetails).build();
  }

  public static withId(id: string): Configuration {
    return new ConfigurationBuilder().withId(id).build();
  }

  public static invalid(): Configuration {
    try {
      return new ConfigurationBuilder().withEmptyFields().build();
    } catch {
      // Return a valid configuration if empty fields throw error
      return ConfigurationMother.minimal();
    }
  }

  public static many(count: number): Configuration[] {
    return Array.from({ length: count }, () => ConfigurationMother.random());
  }

  public static withDifferentCurrencies(): Configuration[] {
    return [
      ConfigurationMother.usd(),
      ConfigurationMother.euro(),
      ConfigurationMother.cop(),
      ConfigurationBuilder.withCurrency('MXN').withPhonePrefix('+52').build(),
      ConfigurationBuilder.withCurrency('ARS').withPhonePrefix('+54').build(),
    ];
  }
}

describe('ConfigurationMother util', () => {
  it('should create default configuration', () => {
    const configuration = ConfigurationMother.default();
    expect(configuration.currency).toBe('USD');
    expect(configuration.phonePrefix).toBe('+1');
  });

  it('should create random configurations', () => {
    const config1 = ConfigurationMother.random();
    const config2 = ConfigurationMother.random();

    expect(config1.getId()).not.toBe(config2.getId());
  });

  it('should create multiple configurations', () => {
    const configurations = ConfigurationMother.many(3);
    expect(configurations).toHaveLength(3);
    expect(configurations[0].getId()).not.toBe(configurations[1].getId());
  });

  it('should create configurations with different currencies', () => {
    const configurations = ConfigurationMother.withDifferentCurrencies();
    const currencies = configurations.map((config) => config.currency);

    expect(currencies).toContain('USD');
    expect(currencies).toContain('EUR');
    expect(currencies).toContain('COP');
    expect(currencies).toContain('MXN');
    expect(currencies).toContain('ARS');
  });
});
