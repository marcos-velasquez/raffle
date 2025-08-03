import { Entity, assert } from '@shared/domain';
import { Raffle, RafflePrimitives } from '@context/shared/domain';

export class History extends Entity<HistoryPrimitives> {
  private constructor(public readonly file: File, public readonly raffle: Raffle) {
    super();
    assert(file.type.includes('video'), 'Invalid file format');
    assert(raffle.is.completed, 'Raffle is not completed');
  }

  public toPrimitives(): HistoryPrimitives {
    return {
      id: this.getId(),
      file: this.file,
      raffle: this.raffle.toPrimitives(),
    };
  }

  public static create({ file, raffle }: HistoryCreatePrimitives) {
    return new History(file, Raffle.from(raffle));
  }
}

export type HistoryPrimitives = {
  id: string;
  file: File;
  raffle: RafflePrimitives;
};

export type HistoryCreatePrimitives = Omit<HistoryPrimitives, 'id'>;
