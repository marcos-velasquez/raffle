import { random } from '@shared/domain';
import { Number, NumberPrimitives, NumberState } from '../number';

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
    number.action.create.payer({ name: 'John Doe', phone: '1234567890', voucher: { id: '123', value: 'ABC123' } });
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
    const primitives: NumberPrimitives = {
      value: 1,
      state: 'available',
      payer: { name: 'John Doe', phone: '1234567890', voucher: { id: '123', value: 'ABC123' } },
    };

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
});
