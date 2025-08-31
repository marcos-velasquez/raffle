import * as E from '@sweet-monads/either';
import { Observable } from 'rxjs';
import { Criteria } from '../criteria/Criteria';

export interface BaseRepository<T> {
  valuesChange(): Observable<T[]>;
  findAll(criteria: Criteria): Promise<E.Either<Error, T[]>>;
  findOne(criteria: Criteria): Promise<E.Either<Error, T | undefined>>;
  save(entity: T): Promise<E.Either<Error, T>>;
  update(entity: T): Promise<E.Either<Error, T>>;
  remove(entity: T): Promise<E.Either<Error, T>>;
}
