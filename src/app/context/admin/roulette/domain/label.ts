import { Raffle } from '@context/shared/domain';

export class Label {
  public static many(raffle: Raffle) {
    return raffle.get.payers.filled.map((payer, i) => `${i + 1}. ${payer.name}`);
  }
}
