import { Entity } from '@shared/domain';

export class Config extends Entity<ConfigPrimitives> {
  constructor(
    public readonly paymentDetails: string,
    public readonly phonePrefix: string,
    public readonly currency: string
  ) {
    super();
  }

  public get suffix() {
    return {
      currency: (value: string | number) => `${value} ${this.currency}`,
    };
  }

  public toPrimitives(): ConfigPrimitives {
    return { ...this };
  }

  public static from(primitives: ConfigPrimitives): Config {
    return new Config(primitives.paymentDetails, primitives.phonePrefix, primitives.currency);
  }

  public static empty(): Config {
    return new Config('', '', '');
  }
}

export type ConfigPrimitives = {
  paymentDetails: string;
  currency: string;
  phonePrefix: string;
};
