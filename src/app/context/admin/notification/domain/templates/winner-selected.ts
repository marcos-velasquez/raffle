import { Template } from '../template';

export class WinnerSelectedTemplate extends Template {
  public toString(): string {
    const isPayerWinner = this.number.is.equal.value(this.winner.value);
    if (isPayerWinner) {
      return `🎉 ¡Felicidades, ${this.payer.name}! 🎉 ¡Eres el ganador de la rifa "${this.raffle.title}"! El número afortunado es el (${this.winner.value}). ¡Disfruta tu premio!`;
    } else {
      return `Informamos a todos los participantes de la rifa "${this.raffle.title}" que ya tenemos un ganador. El número afortunado es el (${this.winner.value}) y el ganador es ${this.winner.get.payer.name}. ¡Felicitaciones al ganador y gracias por participar!`;
    }
  }
}
