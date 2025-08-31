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

  public withName(name: string) {
    this.primitives.name = name;
    return this;
  }

  public withPhone(phone: string) {
    this.primitives.phone = phone;
    return this;
  }

  public withVoucher(voucher: VoucherPrimitives) {
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

describe('PayerBuilder util', () => {
  it('dummy', () => {
    expect(true).toBe(true);
  });
});
