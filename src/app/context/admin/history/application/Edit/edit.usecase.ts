import * as E from '@sweet-monads/either';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { progressBuilder } from '@shared/application';
import { AdminUseCase } from '../../../shared/application';
import { HistoryEditedEvent, HistoryUpdater } from '../../domain';

export type UpdaterHistoryUseCaseProps = HistoryUpdater;

export class EditHistoryUseCase extends AdminUseCase<UpdaterHistoryUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly historyRepository: BaseRepository<HistoryUpdater>) {
    super(
      progressBuilder().withStart('progress.updatingHistory').withComplete('progress.historyUpdatedSuccess').build()
    );
  }

  protected async next(props: UpdaterHistoryUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.historyRepository.update(props);
    result.mapRight((history) => this.bus.publish(new HistoryEditedEvent(history)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
