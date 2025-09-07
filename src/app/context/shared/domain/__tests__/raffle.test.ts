import { random } from '@shared/domain';
import { Raffle, RaffleCreatePrimitives } from '../raffle';
import { Payer } from '../payer';
import { RaffleBuilder } from './builders/raffle.builder.test';
import { RaffleMother } from './builders/raffle.mother.test';
import { PayerBuilder } from './builders/payer.builder.test';

describe('Raffle', () => {
  const validRafflePrimitives: RaffleCreatePrimitives = {
    title: 'Test Raffle',
    description: 'This is a test raffle',
    images: ['image1.jpg', 'image2.jpg'],
    price: 10,
    quantityNumbers: 5,
  };

  it('should create a valid raffle instance', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    expect(raffle).toBeDefined();
    expect(raffle.title).toBe(validRafflePrimitives.title);
    expect(raffle.description).toBe(validRafflePrimitives.description);
    expect(raffle.images).toEqual(validRafflePrimitives.images);
    expect(raffle.price).toBe(validRafflePrimitives.price);
    expect(raffle.get.length).toBe(validRafflePrimitives.quantityNumbers);
  });

  it('should create a raffle from primitives', () => {
    const primitives = RaffleBuilder.random().buildPrimitives();
    const raffle = Raffle.from(primitives);

    expect(raffle).toBeDefined();
    expect(raffle.title).toBe(primitives.title);
    expect(raffle.description).toBe(primitives.description);
    expect(raffle.images).toEqual(primitives.images);
    expect(raffle.price).toBe(primitives.price);
    expect(raffle.get.length).toBe(primitives.numbers.length);
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => Raffle.create({ ...validRafflePrimitives, title: '' })).toThrow('Title is required');
    expect(() => Raffle.create({ ...validRafflePrimitives, description: '' })).toThrow('Description is required');
    expect(() => Raffle.create({ ...validRafflePrimitives, images: [] })).toThrow('At least 1 images are required');
    expect(() => Raffle.create({ ...validRafflePrimitives, price: 0 })).toThrow('Price must be greater than 0');
    expect(() => Raffle.create({ ...validRafflePrimitives, quantityNumbers: 1 })).toThrow(
      'At least 2 numbers are required'
    );
  });

  it('should check raffle initial state', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    expect(raffle.is.purchased).toBe(false);
    expect(raffle.is.completed).toBe(false);
    expect(raffle.has.winner).toBe(false);
    expect(raffle.get.remaining).toBeGreaterThan(0);
  });

  it('should correctly determine if all numbers are purchased', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    raffle.numbers.forEach((number) => number.switch.inPayment());
    raffle.numbers.forEach((number) => number.switch.inVerification());
    raffle.numbers.forEach((number) => number.switch.purchased());
    expect(raffle.is.purchased).toBe(true);
  });

  it('should correctly determine if a number is purchased', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const value = random.int(1, validRafflePrimitives.quantityNumbers);
    const numberToPurchase = raffle.get.number(value);
    numberToPurchase.switch.inPayment();
    numberToPurchase.switch.inVerification();
    numberToPurchase.switch.purchased();
    expect(raffle.is.number(value).purchased).toBe(true);
  });

  it('should correctly determine if is completed', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const value = random.int(1, validRafflePrimitives.quantityNumbers);
    const numberToWin = raffle.get.number(value);
    numberToWin.switch.inPayment();
    numberToWin.switch.inVerification();
    numberToWin.switch.purchased();
    numberToWin.switch.winner();
    expect(raffle.is.number(value).winner).toBe(true);
    expect(raffle.is.completed).toBe(true);
  });

  it('should correctly determine if the raffle has a winner', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const numberToWin = raffle.get.number(random.int(1, validRafflePrimitives.quantityNumbers));
    numberToWin.switch.inPayment();
    numberToWin.switch.inVerification();
    numberToWin.switch.purchased();
    numberToWin.switch.winner();
    expect(raffle.has.winner).toBe(true);
  });

  it('should correctly determine if the raffle has a number', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const validValue = validRafflePrimitives.quantityNumbers;
    const invalidValue = validRafflePrimitives.quantityNumbers + 1;

    expect(raffle.has.number(validValue)).toBe(true);
    expect(raffle.has.number(invalidValue)).toBe(false);
  });

  it('should correctly determine if the raffle has purchased numbers', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const value = random.int(1, validRafflePrimitives.quantityNumbers);
    raffle.get.number(value).switch.inPayment();
    raffle.get.number(value).switch.inVerification();
    raffle.get.number(value).switch.purchased();

    expect(raffle.has.purchased).toBe(true);
  });

  it('should get the correct remaining number count', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const value = random.int(1, validRafflePrimitives.quantityNumbers);
    raffle.get.number(value).switch.inPayment();
    raffle.get.number(value).switch.inVerification();
    raffle.get.number(value).switch.purchased();

    expect(raffle.get.remaining).toBe(validRafflePrimitives.quantityNumbers - 1);
  });

  it('should get the correct purchased number count', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const value = random.int(1, validRafflePrimitives.quantityNumbers);
    for (let i = 1; i <= validRafflePrimitives.quantityNumbers - value; i++) {
      raffle.get.number(i).switch.inPayment();
      raffle.get.number(i).switch.inVerification();
      raffle.get.number(i).switch.purchased();
    }
    expect(raffle.get.purchased).toBe(validRafflePrimitives.quantityNumbers - value);
  });

  it('should get the correct length count', () => {
    const raffle = Raffle.create(validRafflePrimitives);

    expect(raffle.get.length).toBe(validRafflePrimitives.quantityNumbers);
  });

  it('should get the correct payers', () => {
    const raffle = Raffle.create(validRafflePrimitives);

    const payers = raffle.get.payers.all;
    expect(payers.length).toBe(validRafflePrimitives.quantityNumbers);
    expect(payers.every((payer) => payer instanceof Payer)).toBe(true);
  });

  it('should find a number by value', () => {
    const raffle = Raffle.create(validRafflePrimitives);

    const firstNumber = raffle.get.number(1);
    expect(firstNumber.get.value).toBe(1);

    const lastNumber = raffle.get.number(validRafflePrimitives.quantityNumbers);
    expect(lastNumber.get.value).toBe(validRafflePrimitives.quantityNumbers);
  });

  it('should get the action of a number', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    const numberAction = raffle.action.number(1);
    expect(numberAction).toBeDefined();
  });

  it('should check if price is equal', () => {
    const raffle = Raffle.create(validRafflePrimitives);
    expect(raffle.is.equal.price(validRafflePrimitives.price)).toBe(true);
    expect(raffle.is.equal.price(validRafflePrimitives.price - 1)).toBe(false);
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid values', () => {
      const minimalRaffle = RaffleBuilder.minimal().build();
      expect(minimalRaffle.title).toBe('Min');
      expect(minimalRaffle.price).toBe(1);
      expect(minimalRaffle.get.length).toBe(2);
      expect(minimalRaffle.images.length).toBe(1);
    });

    it('should handle large number of tickets', () => {
      const largeRaffle = new RaffleBuilder().withNumbers().count(100).build();
      expect(largeRaffle.get.length).toBe(100);
      expect(largeRaffle.get.remaining).toBe(100);
    });

    it('should handle special characters in title and description', () => {
      const specialRaffle = new RaffleBuilder()
        .withTitle('Rifa Especial ñáéíóú @#$%')
        .withDescription('Descripción con caracteres especiales: ¡¿!?')
        .build();

      expect(specialRaffle.title).toBe('Rifa Especial ñáéíóú @#$%');
      expect(specialRaffle.description).toBe('Descripción con caracteres especiales: ¡¿!?');
    });

    it('should handle multiple image formats', () => {
      const images = ['image1.jpg', 'image2.png', 'image3.gif', 'image4.webp'];
      const raffle = new RaffleBuilder().withImages(images).build();
      expect(raffle.images).toEqual(images);
    });

    it('should handle high prices', () => {
      const expensiveRaffle = new RaffleBuilder().withPrice(999999).build();
      expect(expensiveRaffle.price).toBe(999999);
    });
  });

  describe('Validation', () => {
    it('should validate minimum price constraint', () => {
      expect(() => new RaffleBuilder().withPrice(0).build()).toThrow('Price must be greater than 0');
      expect(() => new RaffleBuilder().withPrice(-1).build()).toThrow('Price must be greater than 0');
    });

    it('should validate minimum images constraint', () => {
      expect(() => new RaffleBuilder().withImages([]).build()).toThrow('At least 1 images are required');
    });

    it('should validate minimum numbers constraint', () => {
      expect(() => new RaffleBuilder().withNumbers().count(1).build()).toThrow('At least 2 numbers are required');
      expect(() => new RaffleBuilder().withNumbers().count(0).build()).toThrow('At least 2 numbers are required');
    });

    it('should validate title is not empty or whitespace', () => {
      expect(() => new RaffleBuilder().withTitle('').build()).toThrow('Title is required');
      expect(() => new RaffleBuilder().withTitle('   ').build()).toThrow('Title is required');
    });

    it('should validate description is not empty or whitespace', () => {
      expect(() => new RaffleBuilder().withDescription('').build()).toThrow('Description is required');
      expect(() => new RaffleBuilder().withDescription('   ').build()).toThrow('Description is required');
    });
  });

  describe('State Management', () => {
    it('should handle complex number state transitions', () => {
      const raffle = new RaffleBuilder().withNumbers().count(5).build();

      raffle.action.number(1).switch.inPayment();
      raffle.action.number(1).create.payer(PayerBuilder.random());
      raffle.action.number(1).switch.inVerification();
      raffle.action.number(1).switch.purchased();

      raffle.action.number(2).switch.inPayment();
      raffle.action.number(2).create.payer(PayerBuilder.random());
      raffle.action.number(2).switch.inVerification();
      raffle.action.number(2).switch.purchased();

      expect(raffle.get.purchased).toBe(2);
      expect(raffle.get.remaining).toBe(3);
      expect(raffle.has.purchased).toBe(true);
    });

    it('should handle winner selection', () => {
      const raffle = new RaffleBuilder().withNumbers().count(3).build();

      raffle.action.number(2).switch.inPayment();
      raffle.action.number(2).create.payer(PayerBuilder.random());
      raffle.action.number(2).switch.inVerification();
      raffle.action.number(2).switch.purchased();
      raffle.action.number(2).switch.winner();

      expect(raffle.is.completed).toBe(true);
      expect(raffle.has.winner).toBe(true);
      expect(raffle.get.winner?.get.value).toBe(2);
    });

    it('should handle payer management', () => {
      const raffle = new RaffleBuilder().build();
      const payer = PayerBuilder.random();

      raffle.action.number(1).create.payer(payer);
      expect(raffle.get.number(1).get.payer.name).toBe(payer.name);

      raffle.action.number(1).remove.payer();
      expect(raffle.get.number(1).has.payer).toBe(false);
    });
  });

  describe('Immutability', () => {
    it('should not mutate original primitives when creating from primitives', () => {
      const originalPrimitives = RaffleBuilder.random().buildPrimitives();
      const originalTitle = originalPrimitives.title;

      Raffle.from(originalPrimitives);

      expect(originalPrimitives.title).toBe(originalTitle);
    });

    it('should create independent copies when using toPrimitives', () => {
      const raffle = RaffleBuilder.random().build();
      const primitives1 = raffle.toPrimitives();
      const primitives2 = raffle.toPrimitives();

      primitives1.title = 'Changed';
      expect(primitives2.title).not.toBe('Changed');
    });

    it('should not affect original raffle when modifying numbers', () => {
      const raffle = RaffleBuilder.random().build();
      const originalRemaining = raffle.get.remaining;

      const number = raffle.get.number(1);
      number.switch.inPayment();

      expect(raffle.get.remaining).toBe(originalRemaining);
    });
  });

  describe('Serialization', () => {
    it('should be reversible with toPrimitives and from', () => {
      const originalRaffle = RaffleBuilder.random().build();
      const primitives = originalRaffle.toPrimitives();
      const deserializedRaffle = Raffle.from(primitives);

      expect(deserializedRaffle.title).toBe(originalRaffle.title);
      expect(deserializedRaffle.description).toBe(originalRaffle.description);
      expect(deserializedRaffle.price).toBe(originalRaffle.price);
      expect(deserializedRaffle.get.length).toBe(originalRaffle.get.length);
    });

    it('should handle complex raffle with purchased numbers in serialization', () => {
      const raffle = new RaffleBuilder()
        .withNumbers()
        .count(10)
        .withNumber(1)
        .payer.random()
        .withNumber(1)
        .state('purchased')
        .withNumber(5)
        .payer.random()
        .withNumber(5)
        .state('inVerification')
        .build();

      const primitives = raffle.toPrimitives();
      const deserialized = Raffle.from(primitives);

      expect(deserialized.get.purchased).toBe(1);
      expect(deserialized.is.number(1).purchased).toBe(true);
      expect(deserialized.is.number(5).inVerification).toBe(true);
    });

    it('should preserve completed state in serialization', () => {
      const completedRaffle = RaffleBuilder.completed().build();
      const primitives = completedRaffle.toPrimitives();
      const deserialized = Raffle.from(primitives);

      expect(deserialized.is.completed).toBe(true);
      expect(deserialized.has.winner).toBe(true);
    });
  });

  describe('Mother Objects Integration', () => {
    it('should work with RaffleMother completed raffle', () => {
      const completedRaffle = Raffle.from(RaffleMother.completed());
      expect(completedRaffle.is.completed).toBe(true);
      expect(completedRaffle.has.winner).toBe(true);
    });

    it('should work with RaffleMother all purchased raffle', () => {
      const allPurchasedRaffle = Raffle.from(RaffleMother.allPurchased());
      expect(allPurchasedRaffle.is.purchased).toBe(true);
      expect(allPurchasedRaffle.get.remaining).toBe(0);
    });

    it('should work with RaffleMother custom price raffle', () => {
      const customPrice = 50;
      const customPriceRaffle = Raffle.from(RaffleMother.withPrice(customPrice));
      expect(customPriceRaffle.price).toBe(customPrice);
    });

    it('should work with RaffleMother custom number count', () => {
      const count = 20;
      const customCountRaffle = Raffle.from(RaffleMother.withNumberCount(count));
      expect(customCountRaffle.get.length).toBe(count);
    });
  });
});
