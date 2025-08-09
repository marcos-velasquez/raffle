import { TemplateTransloco } from '../template.transloco';

export class WinnerSelectedTemplate extends TemplateTransloco {
  public toString(): string {
    const isPayerWinner = this.number.is.equal.value(this.winner.value);
    if (isPayerWinner) {
      return this.translocoService.translate('templates.winner-selected-winner', {
        name: this.payer.name,
        raffleTitle: this.raffle.title,
        winnerNumber: this.winner.value,
      });
    } else {
      return this.translocoService.translate('templates.winner-selected-participant', {
        raffleTitle: this.raffle.title,
        winnerNumber: this.winner.value,
        winnerName: this.winner.get.payer.name,
      });
    }
  }
}
