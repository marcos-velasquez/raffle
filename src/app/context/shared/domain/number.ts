import { assert, not } from '@shared/domain';
import { Payer, PayerPrimitives } from './payer';

export type NumberState = 'available' | 'inPayment' | 'inVerification' | 'purchased' | 'winner';

export class Number {
  private state: NumberState = 'available';
  private payer: Payer = Payer.null();

  private constructor(public readonly value: number) {}

  public get get() {
    return {
      value: this.value,
      state: this.state,
      payer: this.payer,
    };
  }

  public get is() {
    return {
      available: this.state === 'available',
      inPayment: this.state === 'inPayment',
      inVerification: this.state === 'inVerification',
      purchased: this.state === 'purchased',
      winner: this.state === 'winner',
      equal: {
        value: (value: number) => this.value === value,
        state: (state: NumberState) => this.state === state,
      },
    };
  }

  public get has() {
    return {
      payer: not(this.payer.is.null),
    };
  }

  public get action() {
    return {
      create: {
        payer: (payer: PayerPrimitives) => (this.payer = Payer.create(payer)),
      },
      remove: {
        payer: () => {
          this.payer = Payer.null();
        },
      },
    };
  }

  public get switch() {
    return {
      available: () => {
        assert(this.is.inPayment || this.is.inVerification, 'Cannot switch to available');
        this.state = 'available';
      },
      inPayment: () => {
        assert(this.is.available, 'Cannot switch to inPayment');
        this.state = 'inPayment';
      },
      inVerification: () => {
        assert(this.is.inPayment, 'Cannot switch to inVerification');
        this.state = 'inVerification';
      },
      purchased: () => {
        assert(this.is.inVerification, 'Cannot switch to purchased');
        this.state = 'purchased';
      },
      winner: () => {
        assert(this.is.purchased, 'Cannot switch to winner');
        this.state = 'winner';
      },
    };
  }

  public toPrimitives(): NumberPrimitives {
    return {
      value: this.value,
      state: this.state,
      payer: this.payer.toPrimitives(),
    };
  }

  public static from({ value, state, payer }: NumberPrimitives) {
    const number = new Number(value);
    number.state = state;
    number.payer = payer ? Payer.create(payer) : Payer.null();
    return number;
  }

  public static create({ value }: Pick<NumberPrimitives, 'value'>) {
    return new Number(value);
  }

  public static many(quantity: number) {
    return Array.from({ length: quantity }).map((_, value) => Number.create({ value: value + 1 }));
  }
}

export type NumberPrimitives = {
  value: number;
  state: NumberState;
  payer?: PayerPrimitives;
};
