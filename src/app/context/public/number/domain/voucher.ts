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
      value: this.value,
    };
  }

  public static from(primitives: VoucherPrimitives): Voucher {
    return new Voucher(primitives.value);
  }
}

export type VoucherPrimitives = {
  value: File | string;
};
