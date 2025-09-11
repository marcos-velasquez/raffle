import { Entity, assert } from '@shared/domain';
import { Raffle, RafflePrimitives } from '@context/shared/domain';

export class History extends Entity<HistoryPrimitives> {
  private constructor(
    public readonly video: string,
    public readonly raffle: Raffle,
    public readonly deliveryReceipt: string | undefined
  ) {
    super();
    assert(video.trim().length > 0, 'Video is required');
    assert(raffle.is.completed, 'Raffle is not completed');
  }

  public toPrimitives(): HistoryPrimitives {
    return {
      id: this.getId(),
      video: this.video,
      raffle: this.raffle.toPrimitives(),
      deliveryReceipt: this.deliveryReceipt,
    };
  }

  public static from({ id, video, raffle, deliveryReceipt }: HistoryPrimitives) {
    return new History(video, Raffle.from(raffle), deliveryReceipt).withId(id);
  }
}

export type HistoryPrimitives = {
  id: string;
  video: string;
  raffle: RafflePrimitives;
  deliveryReceipt: string | undefined;
};
