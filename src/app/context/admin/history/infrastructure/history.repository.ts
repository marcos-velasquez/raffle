import { Injectable } from '@angular/core';
import * as E from '@sweet-monads/either';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Exception } from '@shared/domain';
import { HistoryCreator, HistoryCreatorPrimitives } from '../domain';

@Injectable({ providedIn: 'root' })
export class PocketbaseHistoryRepository extends PocketbaseRepository<HistoryCreator, HistoryCreatorPrimitives> {
  constructor() {
    super({ collection: Collections.History, mapper: HistoryCreator.create });
  }

  public override async save(history: HistoryCreator): Promise<E.Either<Exception, HistoryCreator>> {
    try {
      const { id, file, raffle } = history.toPrimitives();
      const record = await this.collection.create({ id, video: file, raffle: raffle.id });
      return E.right(this.options.mapper(record as unknown as HistoryCreatorPrimitives));
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }
}
