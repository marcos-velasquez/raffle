import { HistoryCreator } from '@context/admin/history/domain';
import { TemplateTransloco } from '../template.transloco';

export class WinnerSelectedTemplate extends TemplateTransloco {
  constructor(public readonly history: HistoryCreator, value: number) {
    super(history.raffle, value);
  }

  public toString(): string {
    const isPayerWinner = this.number.is.equal.value(this.winner.value);
    const historyUrl = location.origin + '/history/' + this.history.getId();
    if (isPayerWinner) {
      return this.translocoService.translate('templates.winner-selected-winner', {
        name: this.payer.name,
        raffleTitle: this.raffle.title,
        winnerNumber: this.winner.value,
        historyUrl,
      });
    } else {
      return this.translocoService.translate('templates.winner-selected-participant', {
        raffleTitle: this.raffle.title,
        winnerNumber: this.winner.value,
        winnerName: this.winner.get.payer.name,
        historyUrl,
      });
    }
  }
}
