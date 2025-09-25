import { inject, Injectable } from '@angular/core';
import { PocketbaseVoucherRepository } from '@context/shared/infrastructure';
import { BaseSubscriber } from '@shared/infrastructure';
import { PaymentDeclinedEvent } from '../domain';

@Injectable({ providedIn: 'root' })
export class NumberSubscriber extends BaseSubscriber {
  private readonly voucherRepository = inject(PocketbaseVoucherRepository);

  protected listen(): void {
    this.bus.on(PaymentDeclinedEvent).subscribe(({ raffle, value }) => {
      this.voucherRepository.remove(raffle.get.number(value).get.payer.voucher);
    });
  }
}
