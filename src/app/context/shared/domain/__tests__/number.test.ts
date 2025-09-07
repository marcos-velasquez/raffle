import { random } from '@shared/domain';
import { Number, NumberState } from '../number';
import { PayerBuilder } from './builders/payer.builder.test';
import { NumberBuilder } from './builders/number.builder.test';

describe('Number class', () => {
  const value = 1;

  it('should create a new Number instance', () => {
    const number = Number.create({ value });

    expect(number.value).toBe(value);
    expect(number.is.available).toBe(true);
    expect(number.has.payer).toBe(false);
  });

  it('should transition from state correctly', () => {
    const number = Number.create({ value });

    expect(number.is.available).toBe(true);
    number.switch.inPayment();
    expect(number.is.inPayment).toBe(true);
    number.switch.inVerification();
    expect(number.is.inVerification).toBe(true);
    number.switch.purchased();
    expect(number.is.purchased).toBe(true);
    number.switch.winner();
    expect(number.is.winner).toBe(true);
  });

  it('should transition from inPayment to available', () => {
    const number = Number.from({ value, state: 'inPayment' });

    number.switch.available();

    expect(number.is.available).toBe(true);
  });

  it('should transition from inVerification to available', () => {
    const number = Number.from({ value, state: 'inVerification' });

    number.switch.available();

    expect(number.is.available).toBe(true);
  });

  it('should all be false if the winning state is true', () => {
    const number = Number.from({ value, state: 'winner' });

    expect(number.is.available).toBe(false);
    expect(number.is.inPayment).toBe(false);
    expect(number.is.inVerification).toBe(false);
    expect(number.is.purchased).toBe(false);
    expect(number.is.winner).toBe(true);
  });

  it.each([
    { state: 'available', to: ['inPayment'] },
    { state: 'inPayment', to: ['available', 'inVerification'] },
    { state: 'inVerification', to: ['available', 'purchased'] },
    { state: 'purchased', to: ['winner'] },
    { state: 'winner', to: [] },
  ])('should be valid when transitioning from an valid state', ({ state, to }) => {
    to.forEach((toState) => {
      const number = Number.from({ value, state: state as NumberState });

      expect(() => number.switch[toState as NumberState]()).not.toThrow();
    });
  });

  it.each([
    { state: 'available', to: ['inVerification', 'purchased', 'winner'] },
    { state: 'inPayment', to: ['purchased', 'winner'] },
    { state: 'inVerification', to: ['inPayment', 'winner'] },
    { state: 'purchased', to: ['available', 'inPayment', 'inVerification'] },
    { state: 'winner', to: ['available', 'inPayment', 'inVerification', 'purchased'] },
  ])('should throw an error when transitioning from an invalid state', ({ state, to }) => {
    to.forEach((toState) => {
      const number = Number.from({ value, state: state as NumberState });

      expect(() => number.switch[toState as NumberState]()).toThrow();
    });
  });

  it('should verify if value is equal to another value', () => {
    const value = random.int(1, 100);
    const number = Number.create({ value });
    const otherNumber = Number.create({ value });
    expect(number.is.equal.value(otherNumber.get.value)).toBe(true);
    expect(number.is.equal.value(otherNumber.get.value + 1)).toBe(false);
  });

  it('should verify if state is equal to another state', () => {
    const number = Number.from({ value, state: 'inPayment' });
    const otherNumber = Number.from({ value, state: 'inPayment' });
    expect(number.is.equal.state(otherNumber.get.state)).toBe(true);
    expect(number.is.equal.state('available')).toBe(false);
  });

  it('should verify if number has payer', () => {
    const number = Number.create({ value });
    expect(number.has.payer).toBe(false);
    number.action.create.payer(PayerBuilder.random());
    expect(number.has.payer).toBe(true);
    number.action.remove.payer();
    expect(number.has.payer).toBe(false);
  });

  it('should convert to primitives', () => {
    const number = Number.create({ value });

    const primitives = number.toPrimitives();

    expect(primitives).toEqual({
      value: 1,
      state: 'available',
      payer: { name: '', phone: '', voucher: { id: expect.any(String), value: '' } },
    });
  });

  it('should create a new Number instance from primitives', () => {
    const primitives = new NumberBuilder()
      .withValue(1)
      .withState('available')
      .withPayer(new PayerBuilder().withName('John Doe').withPhone('1234567890').build())
      .build();

    const number = Number.from(primitives);

    expect(number.get.value).toBe(primitives.value);
    expect(number.get.state).toBe(primitives.state);
    expect(number.get.payer).toEqual(primitives.payer);
  });

  it('should create multiple Number instances', () => {
    const quantity = random.int(1, 100);

    const numbers = Number.many(quantity);

    expect(numbers.length).toBe(quantity);
    numbers.forEach((number, index) => {
      expect(number.value).toBe(index + 1);
      expect(number.is.available).toBe(true);
      expect(number.has.payer).toEqual(false);
    });
  });

  describe('Edge Cases', () => {
    it('should maintain payer when transitioning between valid states', () => {
      const number = Number.create({ value: 1 });
      const payer = PayerBuilder.random();

      number.action.create.payer(payer);
      number.switch.inPayment();
      expect(number.get.payer).toEqual(payer);

      number.switch.inVerification();
      expect(number.get.payer).toEqual(payer);

      number.switch.purchased();
      expect(number.get.payer).toEqual(payer);
    });

    it('should handle payer operations in different states', () => {
      const primitives = NumberBuilder.withState('inPayment').build();
      const number = Number.from(primitives);
      const newPayer = PayerBuilder.random();

      expect(() => number.action.create.payer(newPayer)).not.toThrow();
      expect(number.get.payer).toEqual(newPayer);
    });
  });

  describe('Error Cases', () => {
    it('should throw specific error when transitioning from winner to any state', () => {
      const number = Number.from(NumberBuilder.withState('winner').build());

      expect(() => number.switch.available()).toThrow();
      expect(() => number.switch.inPayment()).toThrow();
      expect(() => number.switch.inVerification()).toThrow();
      expect(() => number.switch.purchased()).toThrow();
    });

    it('should throw error when trying invalid transitions from available', () => {
      const number = Number.create({ value: 1 });

      expect(() => number.switch.inVerification()).toThrow();
      expect(() => number.switch.purchased()).toThrow();
      expect(() => number.switch.winner()).toThrow();
    });

    it('should throw error when trying invalid transitions from inPayment', () => {
      const number = Number.from(NumberBuilder.withState('inPayment').build());

      expect(() => number.switch.purchased()).toThrow();
      expect(() => number.switch.winner()).toThrow();
    });
  });

  describe('Immutability', () => {
    it('should not mutate original primitives when creating from primitives', () => {
      const originalPrimitives = NumberBuilder.random();
      const originalState = originalPrimitives.state;

      const number = Number.from(originalPrimitives);
      number.switch.inPayment();

      expect(originalPrimitives.state).toBe(originalState);
    });

    it('should not mutate payer when modifying number', () => {
      const originalPayer = PayerBuilder.random();
      const originalName = originalPayer.name;
      const number = Number.create({ value: 1 });

      number.action.create.payer(originalPayer);
      const retrievedPayer = number.get.payer;

      const modifiedPayer = { ...retrievedPayer, name: 'Modified Name' };

      expect(originalPayer.name).toBe(originalName);
      expect(modifiedPayer.name).toBe('Modified Name');
    });

    it('should create independent copies when using toPrimitives', () => {
      const number = Number.from(NumberBuilder.withState('inPayment').withRandomPayer().build());
      const primitives1 = number.toPrimitives();
      const primitives2 = number.toPrimitives();

      primitives1.payer.name = 'Changed';
      expect(primitives2.payer.name).not.toBe('Changed');
    });
  });

  describe('Serialization', () => {
    it('should be reversible with toPrimitives and from', () => {
      const originalPrimitives = NumberBuilder.random();
      const number = Number.from(originalPrimitives);
      const serializedPrimitives = number.toPrimitives();
      const deserializedNumber = Number.from(serializedPrimitives);

      expect(deserializedNumber.get.value).toBe(originalPrimitives.value);
      expect(deserializedNumber.get.state).toBe(originalPrimitives.state);
      expect(deserializedNumber.get.payer.name).toBe(originalPrimitives.payer.name);
      expect(deserializedNumber.get.payer.phone).toBe(originalPrimitives.payer.phone);
    });

    it('should handle complex voucher data in serialization', () => {
      const complexPayer = new PayerBuilder()
        .withName('Complex User')
        .withPhone('+1-555-123-4567')
        .withVoucher({ id: 'complex-voucher-id-123', value: 'VOUCHER-ABC-XYZ-789' })
        .build();

      const primitives = new NumberBuilder().withValue(999).withState('purchased').withPayer(complexPayer).build();

      const number = Number.from(primitives);
      const serialized = number.toPrimitives();
      const deserialized = Number.from(serialized);

      expect(deserialized.get.payer.voucher.getId()).toBe(complexPayer.voucher.id);
      expect(deserialized.get.payer.voucher.value).toBe(complexPayer.voucher.value);
    });
  });
});
