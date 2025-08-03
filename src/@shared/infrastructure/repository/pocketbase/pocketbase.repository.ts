import { Subject, Observable } from 'rxjs';
import * as E from '@sweet-monads/either';
import { RecordModel, RecordService } from 'pocketbase';
import { Collections } from '@pocketbase';
import { pb } from '@shared/infrastructure';
import { Entity, BaseRepository, Criteria } from '@shared/domain';
import { CriteriaConverter } from './criteria.converter';

export abstract class PocketbaseRepository<T extends Entity<K>, K extends { [key: string]: any }>
  implements BaseRepository<T>
{
  protected readonly collection: RecordService<RecordModel>;
  protected readonly subject = new Subject<T>();

  constructor(protected readonly options: { collection: Collections; mapper: (arg: K) => T }) {
    this.collection = pb.collection(this.options.collection);
  }

  public valuesChange(criteria = new Criteria()): Observable<T> {
    this.collection.subscribe(
      '*',
      ({ record }) => {
        const aggregate = this.options.mapper(record as unknown as K);
        this.subject.next(aggregate);
      },
      { filter: new CriteriaConverter(criteria).convert() }
    );
    return this.subject.asObservable();
  }

  public async findAll(criteria = new Criteria()): Promise<E.Either<Error, T[]>> {
    try {
      const result = await this.collection.getFullList({ filter: new CriteriaConverter(criteria).convert() });
      const aggregates = result.map((item) => this.options.mapper(item as unknown as K));
      return E.right(aggregates);
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public findOne(criteria: Criteria): Promise<E.Either<Error, T>> {
    return this.findAll(criteria).then((result) => result.map((a) => a[0]));
  }

  public async save(aggregate: T): Promise<E.Either<Error, T>> {
    try {
      const record = await this.collection.create(aggregate.toPrimitives());
      return E.right(this.options.mapper(record as unknown as K));
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public async update(aggregate: T): Promise<E.Either<Error, T>> {
    try {
      const record = await this.collection.update(aggregate.getId(), aggregate.toPrimitives());
      return E.right(this.options.mapper(record as unknown as K));
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public async remove(aggregate: T): Promise<E.Either<Error, T>> {
    try {
      await this.collection.delete(aggregate.getId());
      return E.right(aggregate);
    } catch (error) {
      return E.left(error as Error);
    }
  }
}
