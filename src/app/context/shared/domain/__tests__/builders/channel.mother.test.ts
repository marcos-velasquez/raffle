import { Channel } from '../../channel';
import { ChannelBuilder } from './channel.builder.test';
import { Currency } from '../../vo/price';

export class ChannelMother {
  public static default(): Channel {
    return new ChannelBuilder().build();
  }

  public static random(): Channel {
    return ChannelBuilder.random().build();
  }

  public static minimal(): Channel {
    return ChannelBuilder.minimal().build();
  }

  public static withCurrency(currency: Currency): Channel {
    return ChannelBuilder.withCurrency(currency).build();
  }

  public static usd(): Channel {
    return ChannelBuilder.usd().build();
  }

  public static euro(): Channel {
    return ChannelBuilder.euro().build();
  }

  public static cop(): Channel {
    return ChannelBuilder.cop().build();
  }

  public static withPaymentDetails(details: string): Channel {
    return new ChannelBuilder().withPaymentDetails(details).build();
  }

  public static withImage(image: string): Channel {
    return new ChannelBuilder().withImage(image).build();
  }

  public static withId(id: string): Channel {
    return new ChannelBuilder().withId(id).build();
  }

  public static invalid(): Channel {
    try {
      return new ChannelBuilder().withEmptyFields().build();
    } catch {
      return ChannelMother.minimal();
    }
  }

  public static many(count: number): Channel[] {
    return Array.from({ length: count }, () => ChannelMother.random());
  }

  public static withDifferentCurrencies(): Channel[] {
    return [ChannelMother.usd(), ChannelMother.euro(), ChannelMother.cop()];
  }
}

describe('ChannelMother util', () => {
  it('should create default channel', () => {
    const channel = ChannelMother.default();
    expect(channel.currency).toBe('usd');
    expect(channel.image).toBe('https://example.com/image.jpg');
  });

  it('should create random channels', () => {
    const channel1 = ChannelMother.random();
    const channel2 = ChannelMother.random();

    expect(channel1.getId()).not.toBe(channel2.getId());
  });

  it('should create multiple channels', () => {
    const channels = ChannelMother.many(3);
    expect(channels[0].getId()).not.toBe(channels[1].getId());
  });

  it('should create channels with different currencies', () => {
    const usdConfig = ChannelMother.usd();
    const euroConfig = ChannelMother.euro();
    const copConfig = ChannelMother.cop();

    expect(usdConfig.currency).toBe('usd');
    expect(usdConfig.image).toBe('https://example.com/usd.jpg');

    expect(euroConfig.currency).toBe('eur');
    expect(euroConfig.image).toBe('https://example.com/eur.jpg');

    expect(copConfig.currency).toBe('cop');
    expect(copConfig.image).toBe('https://example.com/cop.jpg');
  });
});
