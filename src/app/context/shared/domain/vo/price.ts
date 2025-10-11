import { assert } from '@shared/domain';

export type Currency = 'bs' | 'usd' | 'cop' | 'mxn' | 'clp' | 'eur';

export class Price {
  public static readonly currencies: Currency[] = ['bs', 'usd', 'cop', 'mxn', 'clp', 'eur'] as const;

  private constructor(public readonly value: number, public readonly currency: Currency) {
    assert(value > 0, 'Value must be greater than 0');
    assert(currency && Price.currencies.includes(currency), 'Currency is not supported');
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

  public static many(prices: PricePrimitives[]) {
    return prices.map((price) => Price.from(price));
  }
}

export type PricePrimitives = {
  value: number;
  currency: Currency;
};
