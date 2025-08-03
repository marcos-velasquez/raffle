import { random } from '@shared/domain';
import { Raffle, RaffleCreatePrimitives } from '../raffle';
import { Payer } from '../payer';

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
    const createdRaffle = Raffle.create(validRafflePrimitives);
    const primitives = createdRaffle.toPrimitives();
    const raffleFromPrimitives = Raffle.from(primitives);
    expect(raffleFromPrimitives).toBeDefined();
    expect(raffleFromPrimitives.title).toBe(validRafflePrimitives.title);
    expect(raffleFromPrimitives.description).toBe(validRafflePrimitives.description);
    expect(raffleFromPrimitives.images).toEqual(validRafflePrimitives.images);
    expect(raffleFromPrimitives.price).toBe(validRafflePrimitives.price);
    expect(raffleFromPrimitives.get.length).toBe(validRafflePrimitives.quantityNumbers);
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => Raffle.create({ ...validRafflePrimitives, title: '' })).toThrow();
    expect(() => Raffle.create({ ...validRafflePrimitives, description: '' })).toThrow();
    expect(() => Raffle.create({ ...validRafflePrimitives, images: [] })).toThrow();
    expect(() => Raffle.create({ ...validRafflePrimitives, price: 0 })).toThrow();
    expect(() => Raffle.create({ ...validRafflePrimitives, quantityNumbers: 1 })).toThrow();
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
});
