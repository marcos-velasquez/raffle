import * as E from '@sweet-monads/either';
import { EitherBuilder, Criteria, BaseRepository } from '@shared/domain';
import { Query } from '../base.query';

export class FindQuery<T> extends Query<Criteria, Promise<E.Either<void, T[]>>> {
  constructor(private readonly repository: BaseRepository<T>) {
    super();
  }

  public async execute(criteria: Criteria): Promise<E.Either<void, T[]>> {
    this.start();
    const result = await this.repository.findAll(criteria);
    this.complete(result);
    return new EitherBuilder<void, T[]>().fromEitherToEither(result).build();
  }
}
