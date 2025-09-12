import * as E from '@sweet-monads/either';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { progressBuilder } from '@shared/application';
import { AdminUseCase } from '../../../shared/application';
import { HistoryUpdatedEvent, HistoryUpdater, HistoryUpdaterPrimitives } from '../../domain';

export type UpdaterHistoryUseCaseProps = HistoryUpdaterPrimitives;

export class UpdateHistoryUseCase extends AdminUseCase<UpdaterHistoryUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly historyRepository: BaseRepository<HistoryUpdater>) {
    super(
      progressBuilder().withStart('progress.updatingHistory').withComplete('progress.historyUpdatedSuccess').build()
    );
  }

  protected async next(props: UpdaterHistoryUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const history = HistoryUpdater.from(props);
    const result = await this.historyRepository.update(history);
    result.mapRight((history) => this.bus.publish(new HistoryUpdatedEvent(history)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
