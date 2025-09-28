import { Entity, assert } from '@shared/domain';

export class Configuration extends Entity<ConfigurationPrimitives> {
  private constructor(
    public readonly currency: string,
    public readonly phonePrefix: string,
    public readonly paymentDetails: string,
    public readonly image: string
  ) {
    super();
    assert(currency.trim().length > 0, 'Currency is required');
    assert(phonePrefix.trim().length > 0, 'Phone prefix is required');
    assert(paymentDetails.trim().length > 0, 'Payment details are required');
  }

  public get is() {
    return {
      equal: {
        currency: (value: string) => this.currency === value,
        phonePrefix: (value: string) => this.phonePrefix === value,
      },
    };
  }

  public get split() {
    return {
      paymentDetails: this.paymentDetails.split(','),
    };
  }

  public get suffix() {
    return {
      currency: (value: number) => `${value} ${this.currency}`,
    };
  }

  public toPrimitives(): ConfigurationPrimitives {
    return {
      id: this.getId(),
      currency: this.currency,
      phonePrefix: this.phonePrefix,
      paymentDetails: this.paymentDetails,
      image: this.image,
    };
  }

  public static empty(): Configuration {
    return new Configuration('', '', '', '');
  }

  public static from(primitives: ConfigurationPrimitives): Configuration {
    return new Configuration(
      primitives.currency,
      primitives.phonePrefix,
      primitives.paymentDetails,
      primitives.image
    ).withId(primitives.id);
  }

  public static create(primitives: ConfigurationCreatePrimitives): Configuration {
    return new Configuration(primitives.currency, primitives.phonePrefix, primitives.paymentDetails, primitives.image);
  }
}

export type ConfigurationPrimitives = {
  id: string;
  currency: string;
  phonePrefix: string;
  paymentDetails: string;
  image: string;
};

export type ConfigurationUpdatePrimitives = Omit<ConfigurationPrimitives, 'id'>;
export type ConfigurationCreatePrimitives = ConfigurationUpdatePrimitives;
