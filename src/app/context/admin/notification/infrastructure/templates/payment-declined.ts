import { TemplateTransloco } from '../template.transloco';

export class PaymentDeclinedTemplate extends TemplateTransloco {
  public toString(): string {
    return this.translocoService.translate('templates.payment-declined', {
      name: this.payer.name,
      raffleTitle: this.raffle.title,
      number: this.value,
    });
  }
}
