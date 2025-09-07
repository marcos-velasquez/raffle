import { Payer } from '../payer';
import { PayerBuilder } from './builders/payer.builder.test';

describe('Payer Class', () => {
  it('should create a Payer instance with valid primitives', () => {
    const primitives = PayerBuilder.random();
    const payer = Payer.from(primitives);

    expect(payer.name).toBe(primitives.name);
    expect(payer.phone).toBe(primitives.phone);
    expect(payer.voucher.value).toBe(primitives.voucher.value);
    expect(payer.is.null).toBe(false);
  });

  it('should create a null payer if the fields are empty', () => {
    const primitives = PayerBuilder.empty();
    expect(Payer.from(primitives).is.null).toBe(true);
  });

  it.each([
    { field: 'name', value: '' },
    { field: 'phone', value: '' },
    { field: 'voucher', value: { id: 'test', value: '' } },
  ])('should throw an error if $field is empty', ({ field, value }) => {
    const primitives = PayerBuilder.random();
    const invalidPrimitives = { ...primitives, [field]: value };
    expect(() => Payer.from(invalidPrimitives)).toThrow();
  });

  it('should return null for all fields when using null method', () => {
    const nullPayer = Payer.null();
    expect(nullPayer.name).toBe('');
    expect(nullPayer.phone).toBe('');
    expect(nullPayer.voucher.value).toBe('');
    expect(nullPayer.is.null).toBe(true);
  });

  it('should convert to primitives correctly', () => {
    const primitives = PayerBuilder.random();
    const payer = Payer.from(primitives);
    const result = payer.toPrimitives();

    expect(result.name).toBe(primitives.name);
    expect(result.phone).toBe(primitives.phone);
    expect(result.voucher.value).toBe(primitives.voucher.value);
    expect(result.voucher.id).toBe(primitives.voucher.id);
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', () => {
      const primitives = PayerBuilder.withName("José María O'Connor").build();
      const payer = Payer.from(primitives);
      expect(payer.name).toBe("José María O'Connor");
    });

    it('should handle international phone numbers', () => {
      const primitives = PayerBuilder.withPhone('+34-612-345-678').build();
      const payer = Payer.from(primitives);
      expect(payer.phone).toBe('+34-612-345-678');
    });

    it('should handle long voucher values', () => {
      const longVoucher = 'A'.repeat(1000);
      const primitives = new PayerBuilder().withVoucher({ id: 'test-id', value: longVoucher }).build();
      const payer = Payer.from(primitives);
      expect(payer.voucher.value).toBe(longVoucher);
    });

    it('should handle voucher with File object', () => {
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      const primitives = new PayerBuilder().withVoucher({ id: 'file-id', value: file }).build();
      const payer = Payer.from(primitives);
      expect(payer.voucher.value).toBe(file);
    });
  });

  describe('Validation', () => {
    it('should throw specific error for missing name', () => {
      const primitives = new PayerBuilder().withName('').build();
      expect(() => Payer.from(primitives)).toThrow('Name is required');
    });

    it('should throw specific error for missing phone', () => {
      const primitives = new PayerBuilder().withPhone('').build();
      expect(() => Payer.from(primitives)).toThrow('Phone is required');
    });

    it('should throw specific error for missing voucher', () => {
      const primitives = new PayerBuilder().withVoucher({ id: 'test', value: '' }).build();
      expect(() => Payer.from(primitives)).toThrow('Voucher is required');
    });

    it('should validate all fields are present for non-null payer', () => {
      const primitives = PayerBuilder.random();
      const payer = Payer.from(primitives);

      expect(payer.name.length).toBeGreaterThan(0);
      expect(payer.phone.length).toBeGreaterThan(0);
      expect(payer.voucher.value).toBeTruthy();
    });
  });

  describe('Immutability', () => {
    it('should not mutate original primitives when creating payer', () => {
      const originalPrimitives = PayerBuilder.random();
      const originalName = originalPrimitives.name;

      Payer.from(originalPrimitives);

      expect(originalPrimitives.name).toBe(originalName);
    });

    it('should create independent copies when using toPrimitives', () => {
      const payer = Payer.from(PayerBuilder.random());
      const primitives1 = payer.toPrimitives();
      const primitives2 = payer.toPrimitives();

      primitives1.name = 'Changed';
      expect(primitives2.name).not.toBe('Changed');
    });
  });

  describe('Serialization', () => {
    it('should be reversible with toPrimitives and from', () => {
      const originalPrimitives = PayerBuilder.random();
      const payer = Payer.from(originalPrimitives);
      const serializedPrimitives = payer.toPrimitives();
      const deserializedPayer = Payer.from(serializedPrimitives);

      expect(deserializedPayer.name).toBe(originalPrimitives.name);
      expect(deserializedPayer.phone).toBe(originalPrimitives.phone);
      expect(deserializedPayer.voucher.value).toBe(originalPrimitives.voucher.value);
    });

    it('should handle complex data in serialization', () => {
      const complexPrimitives = new PayerBuilder()
        .withName('María José Fernández-González')
        .withPhone('+34-91-123-45-67')
        .withVoucher({
          id: 'complex-voucher-id-with-dashes-123',
          value: 'VOUCHER-WITH-SPECIAL-CHARS-ÑÇ-789',
        })
        .build();

      const payer = Payer.from(complexPrimitives);
      const serialized = payer.toPrimitives();
      const deserialized = Payer.from(serialized);

      expect(deserialized.name).toBe(complexPrimitives.name);
      expect(deserialized.phone).toBe(complexPrimitives.phone);
      expect(deserialized.voucher.value).toBe(complexPrimitives.voucher.value);
    });
  });
});
