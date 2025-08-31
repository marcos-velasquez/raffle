import { Entity } from '@shared/domain';

export class Voucher extends Entity<VoucherPrimitives> {
  constructor(public readonly value: File | string) {
    super();
  }

  public toString(): string {
    return this.value as string;
  }

  public toPrimitives(): VoucherPrimitives {
    return {
      id: this.getId(),
      value: this.value,
    };
  }

  public static empty() {
    return new Voucher('');
  }

  public static from(primitives: VoucherPrimitives): Voucher {
    return new Voucher(primitives.value).withId(primitives.id);
  }

  public static create(primitives: Omit<VoucherPrimitives, 'id'>) {
    return new Voucher(primitives.value);
  }
}

export type VoucherPrimitives = {
  id: string;
  value: File | string;
};
