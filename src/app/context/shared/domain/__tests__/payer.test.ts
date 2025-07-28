import { Payer } from '../payer';

describe('Payer Class', () => {
  it('should create a Payer instance with valid primitives', () => {
    const primitives = { name: 'John Doe', phone: '1234567890', voucher: 'ABC123' };
    const payer = Payer.create(primitives);

    expect(payer.name).toBe(primitives.name);
    expect(payer.phone).toBe(primitives.phone);
    expect(payer.voucher).toBe(primitives.voucher);
    expect(payer.is.null).toBe(false);
  });

  it('should create a null payer if the fields are empty.', () => {
    const primitives = { name: '', phone: '', voucher: '' };
    expect(Payer.create(primitives).is.null).toBe(true);
  });

  it.each([{ name: '' }, { phone: '' }, { voucher: '' }])('should throw an error if a field is empty', (field) => {
    const primitives = { name: 'John Doe', phone: '1234567890', voucher: 'ABC123' };
    expect(() => Payer.create({ ...primitives, ...field })).toThrow();
  });

  it('should return null for all fields when using null method', () => {
    const payer = Payer.null();
    expect(payer.is.null).toBe(true);
  });

  it('should convert to primitives correctly', () => {
    const primitives = { name: 'John Doe', phone: '1234567890', voucher: 'ABC123' };
    const payer = Payer.create(primitives);
    expect(payer.toPrimitives()).toEqual(primitives);
  });
});
