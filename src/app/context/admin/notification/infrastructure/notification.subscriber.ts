import { Injectable } from '@angular/core';
import { bus } from '@shared/domain';
import { BaseSubscriber } from '@shared/infrastructure';
import { WinnerSelectedEvent } from '@context/admin/roulette/domain/roulette.event';
import { PaymentDeclinedEvent, PaymentVerifiedEvent } from '@context/admin/number/domain/number.event';
import { WhatsappSender, PaymentDeclinedTemplate, PaymentVerifiedTemplate, WinnerSelectedTemplate } from '../domain';

@Injectable({ providedIn: 'root' })
export class NotificationSubscriber extends BaseSubscriber {
  protected listen(): void {
    bus.on(PaymentDeclinedEvent).subscribe(({ raffle, value }) => {
      WhatsappSender.create(new PaymentDeclinedTemplate(raffle, value)).send();
    });

    bus.on(PaymentVerifiedEvent).subscribe(({ raffle, value }) => {
      WhatsappSender.create(new PaymentVerifiedTemplate(raffle, value)).send();
    });

    bus.on(WinnerSelectedEvent).subscribe(({ raffle }) => {
      for (const number of raffle.numbers) {
        WhatsappSender.create(new WinnerSelectedTemplate(raffle, number.value)).send();
      }
    });
  }
}
