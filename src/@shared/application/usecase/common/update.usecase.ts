import * as E from '@sweet-monads/either';
import { DomainEvent, EitherBuilder, BaseRepository } from '@shared/domain';
import { UseCase } from '../base.usecase';
import { UseCaseProgress } from '../models';

export class UpdateUseCase<T> extends UseCase<T, Promise<E.Either<void, void>>> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly UpdatedEvent: new (aggregate: T) => DomainEvent,
    progress: UseCaseProgress,
  ) {
    super(progress);
  }

  public async execute(aggregate: T): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.repository.update(aggregate);
    result.mapRight(() => this.bus.publish(new this.UpdatedEvent(aggregate)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
