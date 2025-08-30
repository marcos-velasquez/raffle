import { Injectable } from '@angular/core';
import * as E from '@sweet-monads/either';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Exception } from '@shared/domain';
import { History, HistoryPrimitives } from '../domain';

@Injectable({ providedIn: 'root' })
export class PocketbaseHistoryRepository extends PocketbaseRepository<History, HistoryPrimitives> {
  constructor() {
    super({ collection: Collections.History, mapper: History.create });
  }

  public override async save(history: History): Promise<E.Either<Exception, History>> {
    try {
      const { id, file, raffle } = history.toPrimitives();
      const record = await this.collection.create({ id, video: file, raffle: raffle.id });
      return E.right(this.options.mapper(record as unknown as HistoryPrimitives));
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }
}
