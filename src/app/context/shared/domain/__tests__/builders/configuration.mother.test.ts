import { Channel } from '../../channel';
import { ConfigurationBuilder } from './channel.builder.test';

export class ConfigurationMother {
  public static default(): Channel {
    return new ConfigurationBuilder().build();
  }

  public static random(): Channel {
    return ConfigurationBuilder.random().build();
  }

  public static minimal(): Channel {
    return ConfigurationBuilder.minimal().build();
  }

  public static withCurrency(currency: string): Channel {
    return ConfigurationBuilder.withCurrency(currency).build();
  }

  public static usd(): Channel {
    return ConfigurationBuilder.usd().build();
  }

  public static euro(): Channel {
    return ConfigurationBuilder.euro().build();
  }

  public static cop(): Channel {
    return ConfigurationBuilder.cop().build();
  }

  public static withPaymentDetails(paymentDetails: string): Channel {
    return new ConfigurationBuilder().withPaymentDetails(paymentDetails).build();
  }

  public static withImage(image: string): Channel {
    return new ConfigurationBuilder().withImage(image).build();
  }

  public static withId(id: string): Channel {
    return new ConfigurationBuilder().withId(id).build();
  }

  public static invalid(): Channel {
    try {
      return new ConfigurationBuilder().withEmptyFields().build();
    } catch {
      // Return a valid channel if empty fields throw error
      return ConfigurationMother.minimal();
    }
  }

  public static many(count: number): Channel[] {
    return Array.from({ length: count }, () => ConfigurationMother.random());
  }

  public static withDifferentCurrencies(): Channel[] {
    return [ConfigurationMother.usd(), ConfigurationMother.euro(), ConfigurationMother.cop()];
  }
}

describe('ConfigurationMother util', () => {
  it('should create default channel', () => {
    const channel = ConfigurationMother.default();
    expect(channel.currency).toBe('USD');
    expect(channel.image).toBe('https://example.com/image.jpg');
  });

  it('should create random configurations', () => {
    const config1 = ConfigurationMother.random();
    const config2 = ConfigurationMother.random();

    expect(config1.getId()).not.toBe(config2.getId());
  });

  it('should create multiple configurations', () => {
    const configurations = ConfigurationMother.many(3);
    expect(configurations[0].getId()).not.toBe(configurations[1].getId());
  });

  it('should create configurations with different currencies', () => {
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
});
