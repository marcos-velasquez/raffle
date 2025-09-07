import { NumberPrimitives, NumberState } from '../../number';
import { PayerPrimitives } from '../../payer';
import { PayerBuilder } from './payer.builder.test';

export class NumberBuilder {
  private primitives: NumberPrimitives = {
    value: 1,
    state: 'available',
    payer: {
      name: '',
      phone: '',
      voucher: {
        id: 'test-voucher-id',
        value: ''
      }
    }
  };

  public withValue(value: number): this {
    this.primitives.value = value;
    return this;
  }

  public withState(state: NumberState): this {
    this.primitives.state = state;
    return this;
  }

  public withPayer(payer: PayerPrimitives): this {
    this.primitives.payer = payer;
    return this;
  }

  public withRandomPayer(): this {
    this.primitives.payer = PayerBuilder.random();
    return this;
  }

  public build(): NumberPrimitives {
    return { ...this.primitives };
  }

  public static random(): NumberPrimitives {
    return new NumberBuilder()
      .withValue(Math.floor(Math.random() * 100) + 1)
      .withRandomPayer()
      .build();
  }

  public static withState(state: NumberState): NumberBuilder {
    return new NumberBuilder().withState(state);
  }

  public static withValue(value: number): NumberBuilder {
    return new NumberBuilder().withValue(value);
  }
}

describe('NumberBuilder util', () => {
  it('dummy', () => {
    expect(true).toBe(true);
  });
});
