import { Entity, assert } from '@shared/domain';
import { Raffle, RafflePrimitives } from '@context/shared/domain';

export class HistoryCreator extends Entity<HistoryCreatorPrimitives> {
  private constructor(public readonly file: File, public readonly raffle: Raffle) {
    super();
    assert(file.type.includes('video'), 'Invalid file format');
    assert(raffle.is.completed, 'Raffle is not completed');
  }

  public toPrimitives(): HistoryCreatorPrimitives {
    return {
      id: this.getId(),
      file: this.file,
      raffle: this.raffle.toPrimitives(),
    };
  }

  public static create({ file, raffle }: HistoryCreatorPrimitives) {
    return new HistoryCreator(file, Raffle.from(raffle));
  }
}

export type HistoryCreatorPrimitives = {
  id?: string;
  file: File;
  raffle: RafflePrimitives;
};
