import { Number, NumberState } from '../../number';
import { Raffle, RafflePrimitives } from '../../raffle';
import { PayerBuilder } from './payer.builder';

// Test dummy para Jest
describe('RaffleBuilder util', () => {
  it('dummy', () => { expect(true).toBe(true); });
});

export class RaffleBuilder {
  protected readonly primitives: RafflePrimitives = {
    id: 'test',
    title: 'Test',
    description: 'Test',
    images: ['test.png'],
    price: 1,
    completed: false,
    numbers: Number.many(5).map((number) => number.toPrimitives()),
  };

  public withTitle(title: string): this {
    this.primitives.title = title;
    return this;
  }

  public withDescription(description: string): this {
    this.primitives.description = description;
    return this;
  }

  public withImages(images: string[]): this {
    this.primitives.images = images;
    return this;
  }

  public withPrice(price: number): this {
    this.primitives.price = price;
    return this;
  }

  public withCompleted(completed: boolean): this {
    this.primitives.completed = completed;
    return this;
  }

  public withNumber(value: number) {
    return {
      payer: {
        random: () => {
          this.primitives.numbers.find((n) => n.value === value).payer = PayerBuilder.random();
          return this;
        },
      },
      state: (state: NumberState) => {
        this.primitives.numbers.find((n) => n.value === value).state = state;
        return this;
      },
    };
  }

  public withNumbers() {
    return {
      purchased: () => {
        this.primitives.numbers.forEach((number) => {
          number.state = 'purchased';
        });
        return this;
      },
      payer: {
        random: () => {
          this.primitives.numbers.forEach((number) => {
            this.withNumber(number.value).payer.random();
          });
          return this;
        },
      },
      count: (count: number) => {
        this.primitives.numbers = Number.many(count).map((number) => number.toPrimitives());
        return this;
      },
    };
  }

  public getNumbers() {
    return this.primitives.numbers;
  }

  public build() {
    return Raffle.from(this.primitives);
  }
}
