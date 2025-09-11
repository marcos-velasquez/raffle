import { assert, Entity } from '@shared/domain';
import { History, HistoryPrimitives } from '@context/public/history/domain';

export class HistoryUpdater extends Entity<HistoryUpdaterPrimitives> {
  private constructor(private readonly history: History, private readonly deliveryReceipt: File) {
    super();
    assert(deliveryReceipt.type.includes('image'), 'Invalid file format');
  }

  public toPrimitives(): HistoryUpdaterPrimitives {
    return {
      id: this.getId(),
      history: this.history.toPrimitives(),
      deliveryReceipt: this.deliveryReceipt,
    };
  }

  public static from({ id, history, deliveryReceipt }: HistoryUpdaterPrimitives) {
    return new HistoryUpdater(History.from(history), deliveryReceipt).withId(id);
  }
}

export type HistoryUpdaterPrimitives = {
  id: string;
  history: HistoryPrimitives;
  deliveryReceipt: File;
};
