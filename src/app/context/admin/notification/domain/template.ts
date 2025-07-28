import { Number, Payer, Raffle } from '@context/shared/domain';

export abstract class Template {
  public readonly payer: Payer;
  public readonly number: Number;
  public readonly winner: Number;

  constructor(protected readonly raffle: Raffle, protected readonly value: number) {
    this.number = this.raffle.get.number(this.value);
    this.payer = this.number.get.payer;
    this.winner = this.raffle.get.winner;
  }

  public abstract toString(): string;
}
