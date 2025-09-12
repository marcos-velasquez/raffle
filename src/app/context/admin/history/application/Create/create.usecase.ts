import * as E from '@sweet-monads/either';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { HistoryCreator, HistoryCreatorPrimitives } from '@context/admin/history/domain/history-creator';
import { AdminUseCase } from '../../../shared/application';
import { HistoryCreatedEvent } from '../../domain';

export type CreateHistoryUseCaseProps = HistoryCreatorPrimitives;

export class CreateHistoryUseCase extends AdminUseCase<CreateHistoryUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly historyRepository: BaseRepository<HistoryCreator>) {
    super();
  }

  protected async next(props: CreateHistoryUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const history = HistoryCreator.create(props);
    const result = await this.historyRepository.save(history);
    result.mapRight((history) => this.bus.publish(new HistoryCreatedEvent(history)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
