import { PayerPrimitives } from '../../payer';

// Test dummy para Jest
describe('PayerBuilder util', () => {
  it('dummy', () => { expect(true).toBe(true); });
});

export class PayerBuilder {
  private primitives: PayerPrimitives = {
    name: 'Test Name',
    phone: '123456789',
    voucher: 'voucher-123',
  };

  public withName(name: string) {
    this.primitives.name = name;
    return this;
  }

  public withPhone(phone: string) {
    this.primitives.phone = phone;
    return this;
  }

  public withVoucher(voucher: string) {
    this.primitives.voucher = voucher;
    return this;
  }

  public build(): PayerPrimitives {
    return { ...this.primitives };
  }

  public static random(): PayerPrimitives {
    return new PayerBuilder().build();
  }
}
