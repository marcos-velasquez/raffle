import * as E from '@sweet-monads/either';
import { DomainEvent, EitherBuilder, BaseRepository } from '@shared/domain';
import { UseCase } from '../base.usecase';
import { UseCaseProgress } from '../models';

export abstract class SaveUseCase<T, K> extends UseCase<T, Promise<E.Either<void, void>>> {
  constructor(
    protected readonly repository: BaseRepository<K>,
    protected readonly SavedEvent: new (aggregate: K) => DomainEvent,
    progress: UseCaseProgress,
  ) {
    super(progress);
  }

  public async execute(input: T): Promise<E.Either<void, void>> {
    this.start();
    const aggregate = this.create(input);
    const result = await this.repository.save(aggregate);
    result.mapRight(() => this.bus.publish(new this.SavedEvent(aggregate)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }

  protected abstract create(input: T): K;
}
