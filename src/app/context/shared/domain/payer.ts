import { object, assert, or, not } from '@shared/domain';
import { Voucher, VoucherPrimitives } from './voucher';

export class Payer {
  private constructor(public readonly name: string, public readonly phone: string, public readonly voucher: Voucher) {}

  public get is() {
    return {
      null: or(not(this.name), not(this.phone), not(this.voucher)),
    };
  }

  public toPrimitives(): PayerPrimitives {
    return {
      name: this.name,
      phone: this.phone,
      voucher: this.voucher.toPrimitives(),
    };
  }

  public static from(primitives: PayerPrimitives) {
    return object.all
      .empty({ ...primitives, voucher: primitives.voucher.value })
      .mapRight(() => Payer.null())
      .mapLeft(() => {
        assert(primitives.name.length > 0, 'Name is required');
        assert(primitives.phone.length > 0, 'Phone is required');
        assert(!!primitives.voucher.value, 'Voucher is required');
        return new Payer(primitives.name, primitives.phone, Voucher.from(primitives.voucher));
      }).value;
  }

  public static null() {
    return new Payer('', '', Voucher.empty());
  }
}

export type PayerPrimitives = {
  name: string;
  phone: string;
  voucher: VoucherPrimitives;
};
