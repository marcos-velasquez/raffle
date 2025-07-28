import * as E from '@sweet-monads/either';
import { Observable } from 'rxjs';
import { Criteria } from '../criteria/Criteria';

export interface BaseRepository<T> {
  valuesChange(): Observable<T>;
  findAll(criteria: Criteria): Promise<E.Either<Error, T[]>>;
  findOne(criteria: Criteria): Promise<E.Either<Error, T | undefined>>;
  save(aggregate: T): Promise<E.Either<Error, T>>;
  update(aggregate: T): Promise<E.Either<Error, T>>;
  remove(aggregate: T): Promise<E.Either<Error, T>>;
}
