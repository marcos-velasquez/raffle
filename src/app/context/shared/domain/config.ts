import { Entity } from '@shared/domain';

export class Config extends Entity<ConfigPrimitives> {
  constructor(
    public readonly paymentDetails: string,
    public readonly phonePrefix: string,
    public readonly currencySuffix: string
  ) {
    super();
  }

  public toPrimitives(): ConfigPrimitives {
    return { ...this };
  }

  public static from(primitives: ConfigPrimitives): Config {
    return new Config(primitives.paymentDetails, primitives.phonePrefix, primitives.currencySuffix);
  }

  public static empty(): Config {
    return new Config('', '', '');
  }
}

export type ConfigPrimitives = {
  paymentDetails: string;
  phonePrefix: string;
  currencySuffix: string;
};
