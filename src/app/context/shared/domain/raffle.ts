import { Aggregate, assert, boolean, not } from '@shared/domain';
import { Number, NumberPrimitives } from './number';
import { PayerPrimitives } from './payer';

export class Raffle extends Aggregate<RafflePrimitives> {
  public static readonly MIN_PRICE = 1;
  public static readonly MIN_IMAGES = 1;
  public static readonly MIN_NUMBERS = 2;

  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly images: string[],
    public readonly price: number,
    public readonly numbers: Number[],
  ) {
    super();
    assert(title.trim().length > 0, 'Title is required');
    assert(description.trim().length > 0, 'Description is required');
    assert(images.length >= Raffle.MIN_IMAGES, `At least ${Raffle.MIN_IMAGES} images are required`);
    assert(price >= Raffle.MIN_PRICE, 'Price must be greater than 0');
    assert(numbers.length >= Raffle.MIN_NUMBERS, `At least ${Raffle.MIN_NUMBERS} numbers are required`);
  }

  public get is() {
    return {
      purchased: this.numbers.every((number) => number.is.purchased),
      completed: this.numbers.some((number) => number.is.winner),
      number: (value: number) => ({ ...this.find(value).is }),
      equal: {
        price: (value: number) => this.price === value,
      },
    };
  }

  public get get() {
    return {
      length: this.numbers.length,
      remaining: this.numbers.filter((number) => not(number.is.purchased)).length,
      purchased: this.numbers.filter((number) => number.is.purchased).length,
      winner: this.numbers.find((number) => number.is.winner),
      number: (value: number) => this.find(value),
      payers: {
        all: this.numbers.map((number) => number.get.payer),
        filled: this.numbers.filter((n) => n.has.payer).map((number) => number.get.payer),
      },
    };
  }

  public get has() {
    return {
      purchased: boolean(this.get.purchased),
      winner: boolean(this.get.winner),
      number: (value: number) => boolean(this.find(value)),
    };
  }

  public get action() {
    return {
      number: (value: number) => ({
        remove: {
          payer: () => this.find(value).action.remove.payer(),
        },
        create: {
          payer: (payer: PayerPrimitives) => this.find(value).action.create.payer(payer),
        },
        switch: {
          available: () => this.find(value).switch.available(),
          inPayment: () => this.find(value).switch.inPayment(),
          inVerification: () => this.find(value).switch.inVerification(),
          purchased: () => this.find(value).switch.purchased(),
          winner: () => this.find(value).switch.winner(),
        },
      }),
    };
  }

  private find(value: number): Number {
    return this.numbers.find((number) => number.value === value) as Number;
  }

  public toPrimitives(): RafflePrimitives {
    return {
      id: this.getId(),
      title: this.title,
      description: this.description,
      images: this.images,
      price: this.price,
      completed: this.is.completed,
      numbers: this.numbers.map((number) => number.toPrimitives()),
    };
  }

  public static from({ title, description, images, price, numbers, id }: RafflePrimitives) {
    return new Raffle(
      title,
      description,
      images,
      price,
      numbers.map((primitives) => Number.from(primitives)),
    ).withId(id);
  }

  public static create({ title, description, images, price, quantityNumbers }: RaffleCreatePrimitives) {
    return new Raffle(title, description, images, price, Number.many(quantityNumbers));
  }
}

export type RafflePrimitives = {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  completed: boolean;
  numbers: NumberPrimitives[];
};

export type RaffleEditPrimitives = Omit<RafflePrimitives, 'id' | 'numbers' | 'completed'>;
export type RaffleCreatePrimitives = RaffleEditPrimitives & { quantityNumbers: number };
