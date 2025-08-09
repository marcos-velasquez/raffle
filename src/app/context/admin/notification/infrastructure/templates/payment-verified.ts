import { TemplateTransloco } from '../template.transloco';

export class PaymentVerifiedTemplate extends TemplateTransloco {
  public toString(): string {
    return this.translocoService.translate('templates.payment-verified', {
      name: this.payer.name,
      raffleTitle: this.raffle.title,
      number: this.value,
    });
  }
}
