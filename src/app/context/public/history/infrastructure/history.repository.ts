import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import * as E from '@sweet-monads/either';
import { PocketbaseRepository } from '@shared/infrastructure';
import { object } from '@shared/domain';
import { History, HistoryPrimitives } from '../domain';

@Injectable({ providedIn: 'root' })
export class PocketbaseHistoryRepository extends PocketbaseRepository<History, HistoryPrimitives> {
  constructor() {
    super({ collection: Collections.History, mapper: History.from });
  }

  public override async findAll(): Promise<E.Either<Error, History[]>> {
    try {
      const result = await this.collection.getFullList({ expand: 'raffle' });
      const histories = result.map((item) => object.merge(item, item.expand));
      const entities = histories.map((item) => this.options.mapper(item as unknown as HistoryPrimitives));
      return E.right(entities);
    } catch (error) {
      return E.left(error as Error);
    }
  }
}
