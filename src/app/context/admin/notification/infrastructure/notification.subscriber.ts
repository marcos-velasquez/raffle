import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { bus } from '@shared/domain';
import { BaseSubscriber } from '@shared/infrastructure';
import { WinnerSelectedEvent } from '@context/admin/roulette/domain/roulette.event';
import { PaymentDeclinedEvent, PaymentVerifiedEvent } from '@context/admin/number/domain/number.event';
import { WhatsappSender } from '../domain';
import { TemplateTransloco, translate } from './template.transloco';
import * as _ from './templates';

@Injectable({ providedIn: 'root' })
export class NotificationSubscriber extends BaseSubscriber {
  private readonly translate: (template: TemplateTransloco) => TemplateTransloco;

  constructor(translocoService: TranslocoService) {
    super();
    this.translate = translate(translocoService);
  }

  protected listen(): void {
    bus.on(PaymentDeclinedEvent).subscribe(({ raffle, value }) => {
      WhatsappSender.create(this.translate(new _.PaymentDeclinedTemplate(raffle, value))).send();
    });

    bus.on(PaymentVerifiedEvent).subscribe(({ raffle, value }) => {
      WhatsappSender.create(this.translate(new _.PaymentVerifiedTemplate(raffle, value))).send();
    });

    bus.on(WinnerSelectedEvent).subscribe(({ raffle }) => {
      for (const number of raffle.numbers) {
        WhatsappSender.create(this.translate(new _.WinnerSelectedTemplate(raffle, number.value))).send();
      }
    });
  }
}
