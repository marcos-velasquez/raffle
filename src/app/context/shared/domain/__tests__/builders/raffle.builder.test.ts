import { Number, NumberState } from '../../number';
import { Raffle, RafflePrimitives } from '../../raffle';
import { PayerBuilder } from './payer.builder.test';

export class RaffleBuilder {
  protected readonly primitives: RafflePrimitives = {
    id: 'test-raffle-id',
    title: 'Test Raffle',
    description: 'Test raffle description',
    images: ['test1.png', 'test2.png'],
    price: 10,
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

  public withId(id: string): this {
    this.primitives.id = id;
    return this;
  }

  public withMinimalData(): this {
    this.primitives.title = 'Min';
    this.primitives.description = 'Min desc';
    this.primitives.images = ['min.png'];
    this.primitives.price = 1;
    this.primitives.numbers = Number.many(2).map((number) => number.toPrimitives());
    return this;
  }

  public withEmptyFields(): this {
    this.primitives.title = '';
    this.primitives.description = '';
    this.primitives.images = [];
    this.primitives.price = 0;
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

  public buildPrimitives(): RafflePrimitives {
    return { ...this.primitives };
  }

  public static random(): RaffleBuilder {
    const randomId = Math.random().toString(36).substring(7);
    return new RaffleBuilder()
      .withId(`raffle-${randomId}`)
      .withTitle(`Raffle ${randomId}`)
      .withDescription(`Description for raffle ${randomId}`)
      .withPrice(Math.floor(Math.random() * 100) + 1)
      .withNumbers().count(Math.floor(Math.random() * 48) + 2);
  }

  public static minimal(): RaffleBuilder {
    return new RaffleBuilder().withMinimalData();
  }

  public static withTitle(title: string): RaffleBuilder {
    return new RaffleBuilder().withTitle(title);
  }

  public static withPrice(price: number): RaffleBuilder {
    return new RaffleBuilder().withPrice(price);
  }

  public static completed(): RaffleBuilder {
    return new RaffleBuilder()
      .withCompleted(true)
      .withNumber(1).state('winner');
  }
}

describe('RaffleBuilder util', () => {
  it('should build a raffle with default values', () => {
    const raffle = new RaffleBuilder().build();
    expect(raffle.title).toBe('Test Raffle');
    expect(raffle.price).toBe(10);
    expect(raffle.get.length).toBe(5);
  });

  it('should build a raffle with custom values', () => {
    const raffle = new RaffleBuilder()
      .withTitle('Custom Title')
      .withPrice(25)
      .withNumbers().count(10)
      .build();
    
    expect(raffle.title).toBe('Custom Title');
    expect(raffle.price).toBe(25);
    expect(raffle.get.length).toBe(10);
  });

  it('should create random raffles', () => {
    const raffle1 = RaffleBuilder.random().build();
    const raffle2 = RaffleBuilder.random().build();
    
    expect(raffle1.title).not.toBe(raffle2.title);
    expect(raffle1.getId()).not.toBe(raffle2.getId());
  });
});
