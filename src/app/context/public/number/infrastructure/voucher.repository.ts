import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Voucher, VoucherPrimitives } from '../domain/voucher';

@Injectable({ providedIn: 'root' })
export class PocketbaseVoucherRepository extends PocketbaseRepository<Voucher, VoucherPrimitives> {
  constructor() {
    super({ collection: Collections.Vouchers, mapper: Voucher.from });
  }
}
