import { assert, Entity } from '@shared/domain';
import { History, HistoryPrimitives } from '@context/shared/domain';

export class HistoryUpdater extends Entity<HistoryUpdaterPrimitives> {
  private constructor(private readonly history: History, private readonly deliveryReceipt: File) {
    super();
    assert(deliveryReceipt.type.includes('image'), 'Invalid file format');
  }

  public toPrimitives(): HistoryUpdaterPrimitives {
    return {
      history: this.history.toPrimitives(),
      deliveryReceipt: this.deliveryReceipt,
    };
  }

  public static from({ history, deliveryReceipt }: HistoryUpdaterPrimitives) {
    return new HistoryUpdater(History.from(history), deliveryReceipt);
  }
}

export type HistoryUpdaterPrimitives = {
  history: HistoryPrimitives;
  deliveryReceipt: File;
};
