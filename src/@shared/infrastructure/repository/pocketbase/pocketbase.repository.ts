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
    this.collection.subscribe('*', ({ record }) => this.subject.next(this.options.mapper(record as unknown as K)), {
      filter: new CriteriaConverter(criteria).convert(),
    });
    return this.subject.asObservable();
  }

  public async findAll(criteria = new Criteria()): Promise<E.Either<Error, T[]>> {
    try {
      const result = await this.collection.getFullList({ filter: new CriteriaConverter(criteria).convert() });
      const entities = result.map((item) => this.options.mapper(item as unknown as K));
      return E.right(entities);
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public findOne(criteria: Criteria): Promise<E.Either<Error, T>> {
    return this.findAll(criteria).then((result) => result.map((a) => a[0]));
  }

  public async save(entity: T): Promise<E.Either<Error, T>> {
    try {
      const record = await this.collection.create(entity.toPrimitives());
      return E.right(this.options.mapper(record as unknown as K));
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public async update(entity: T): Promise<E.Either<Error, T>> {
    try {
      const record = await this.collection.update(entity.getId(), entity.toPrimitives());
      return E.right(this.options.mapper(record as unknown as K));
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public async remove(entity: T): Promise<E.Either<Error, T>> {
    try {
      await this.collection.delete(entity.getId());
      return E.right(entity);
    } catch (error) {
      return E.left(error as Error);
    }
  }
}
