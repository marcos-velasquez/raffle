import { Injectable } from '@angular/core';
import * as E from '@sweet-monads/either';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Exception } from '@shared/domain';
import { HistoryCreator, HistoryCreatorPrimitives, HistoryUpdater, HistoryUpdaterPrimitives } from '../domain';

type History = HistoryCreator | HistoryUpdater;
type HistoryPrimitives = HistoryCreatorPrimitives | HistoryUpdaterPrimitives;

@Injectable({ providedIn: 'root' })
export class PocketbaseHistoryRepository extends PocketbaseRepository<History, HistoryPrimitives> {
  constructor() {
    super({ collection: Collections.History, mapper: HistoryCreator.create });
  }

  public override async save(history: History): Promise<E.Either<Exception, History>> {
    try {
      const { id, file, raffle } = (history as HistoryCreator).toPrimitives();
      const record = await this.collection.create({ id, video: file, raffle: raffle.id });
      return E.right(this.options.mapper(record as unknown as HistoryCreatorPrimitives));
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }

  public override async update(history: History): Promise<E.Either<Exception, History>> {
    try {
      const { history: historyPrimitives, deliveryReceipt } = (history as HistoryUpdater).toPrimitives();
      const record = await this.collection.update(historyPrimitives.id, {
        ...historyPrimitives,
        raffle: historyPrimitives.raffle.id,
        deliveryReceipt,
      });
      return E.right(this.options.mapper(record as unknown as HistoryUpdaterPrimitives));
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }
}
