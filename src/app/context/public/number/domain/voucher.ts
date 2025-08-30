import { assert } from '@shared/domain';
import { Entity } from '@shared/domain';

export class Voucher extends Entity<VoucherPrimitives> {
  constructor(public readonly file: File) {
    super();
    assert(file instanceof File, 'file must be a File');
    assert(file.size > 0, 'file must not be empty');
    assert(file.type.includes('image/'), 'file must be an image');
  }

  public toPrimitives(): VoucherPrimitives {
    return {
      file: this.file,
    };
  }

  public static from(primitives: VoucherPrimitives): Voucher {
    return new Voucher(primitives.file);
  }
}

export type VoucherPrimitives = {
  file: File;
};
