import * as E from '@sweet-monads/either';
import { Observable } from 'rxjs';
import { Criteria } from '../criteria/Criteria';
import { Exception } from '../exception/base.exception';

export interface BaseRepository<T> {
  valuesChange(): Observable<T[]>;
  findAll(criteria: Criteria): Promise<E.Either<Exception, T[]>>;
  findOne(criteria: Criteria): Promise<E.Either<Exception, T | undefined>>;
  save(entity: T): Promise<E.Either<Exception, T>>;
  update(entity: T): Promise<E.Either<Exception, T>>;
  remove(entity: T): Promise<E.Either<Exception, T>>;
}
