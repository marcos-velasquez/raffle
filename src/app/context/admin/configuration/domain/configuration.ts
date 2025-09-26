import { Entity, assert } from '@shared/domain';

export class Configuration extends Entity<ConfigurationPrimitives> {
  private constructor(
    public readonly currency: string,
    public readonly phonePrefix: string,
    public readonly paymentDetails: string
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

  public toPrimitives(): ConfigurationPrimitives {
    return {
      id: this.getId(),
      currency: this.currency,
      phonePrefix: this.phonePrefix,
      paymentDetails: this.paymentDetails,
    };
  }

  public static from(primitives: ConfigurationPrimitives): Configuration {
    return new Configuration(primitives.currency, primitives.phonePrefix, primitives.paymentDetails).withId(
      primitives.id
    );
  }
}

export type ConfigurationPrimitives = {
  id: string;
  currency: string;
  phonePrefix: string;
  paymentDetails: string;
};

export type ConfigurationUpdatePrimitives = Omit<ConfigurationPrimitives, 'id'>;
