import { assert } from '@shared/domain';

export class Price {
  private constructor(public readonly value: number, public readonly currency: string) {
    assert(value > 0, 'Value must be greater than 0');
    assert(currency.trim().length > 0, 'Currency is required');
  }

  public get is() {
    return {
      equal: (value: number) => this.value === value,
    };
  }

  public toString(): string {
    return `${this.value} ${this.currency}`;
  }

  public toPrimitives(): PricePrimitives {
    return {
      value: this.value,
      currency: this.currency,
    };
  }

  public static from({ value, currency }: PricePrimitives) {
    return new Price(value, currency);
  }
}

export type PricePrimitives = {
  value: number;
  currency: string;
};
