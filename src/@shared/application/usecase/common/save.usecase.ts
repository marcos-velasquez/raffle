import * as E from '@sweet-monads/either';
import { DomainEvent, EitherBuilder, BaseRepository } from '@shared/domain';
import { UseCase } from '../base.usecase';
import { UseCaseProgress } from '../models';

export abstract class SaveUseCase<T, K> extends UseCase<T, Promise<E.Either<void, void>>> {
  constructor(
    protected readonly repository: BaseRepository<K>,
    protected readonly SavedEvent: new (entity: K) => DomainEvent,
    progress: UseCaseProgress
  ) {
    super(progress);
  }

  public async execute(props: T): Promise<E.Either<void, void>> {
    this.start();
    const entity = this.create(props);
    const result = await this.repository.save(entity);
    result.mapRight(() => this.bus.publish(new this.SavedEvent(entity)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }

  protected abstract create(props: T): K;
}
