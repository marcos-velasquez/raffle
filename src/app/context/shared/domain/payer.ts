import { object, assert, or, not } from '@shared/domain';

export class Payer {
  private constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly voucher: string,
  ) {}

  public get is() {
    return {
      null: or(not(this.name), not(this.phone), not(this.voucher)),
    };
  }

  public toPrimitives(): PayerPrimitives {
    return {
      name: this.name,
      phone: this.phone,
      voucher: this.voucher,
    };
  }

  public static create(primitives: PayerPrimitives) {
    return object.all
      .empty(primitives)
      .mapRight(() => Payer.null())
      .mapLeft(() => {
        assert(primitives.name.length > 0, 'Name is required');
        assert(primitives.phone.length > 0, 'Phone is required');
        assert(primitives.voucher.length > 0, 'Voucher is required');
        return new Payer(primitives.name, primitives.phone, primitives.voucher);
      }).value;
  }

  public static null() {
    return new Payer('', '', '');
  }
}

export type PayerPrimitives = {
  name: string;
  phone: string;
  voucher: string;
};
