import { PayerPrimitives } from '../../payer';
import { VoucherPrimitives } from '../../voucher';

export class PayerBuilder {
  private primitives: PayerPrimitives = {
    name: 'Test Name',
    phone: '123456789',
    voucher: {
      id: 'voucher-id-123',
      value: 'voucher-123',
    },
  };

  public withName(name: string): this {
    this.primitives.name = name;
    return this;
  }

  public withPhone(phone: string): this {
    this.primitives.phone = phone;
    return this;
  }

  public withVoucher(voucher: VoucherPrimitives): this {
    this.primitives.voucher = voucher;
    return this;
  }

  public withEmptyFields(): this {
    this.primitives.name = '';
    this.primitives.phone = '';
    this.primitives.voucher = { id: '', value: '' };
    return this;
  }

  public build(): PayerPrimitives {
    return { ...this.primitives };
  }

  public static random(): PayerPrimitives {
    const randomId = Math.random().toString(36).substring(7);
    return new PayerBuilder()
      .withName(`User-${randomId}`)
      .withPhone(`+1-555-${Math.floor(Math.random() * 9000) + 1000}`)
      .withVoucher({ 
        id: `voucher-${randomId}`, 
        value: `VOUCHER-${randomId.toUpperCase()}` 
      })
      .build();
  }

  public static empty(): PayerPrimitives {
    return new PayerBuilder().withEmptyFields().build();
  }

  public static withName(name: string): PayerBuilder {
    return new PayerBuilder().withName(name);
  }

  public static withPhone(phone: string): PayerBuilder {
    return new PayerBuilder().withPhone(phone);
  }
}

describe('PayerBuilder util', () => {
  it('dummy', () => {
    expect(true).toBe(true);
  });
});
