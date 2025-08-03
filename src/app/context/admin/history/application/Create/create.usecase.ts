import * as E from '@sweet-monads/either';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { History, HistoryCreatePrimitives } from '@context/admin/history/domain/history';
import { AdminUseCase } from '../../../shared/application';
import { HistoryCreatedEvent } from '../../domain';

export type CreateHistoryProps = HistoryCreatePrimitives;

export class CreateHistoryUseCase extends AdminUseCase<CreateHistoryProps, Promise<E.Either<void, void>>> {
  constructor(private readonly historyRepository: BaseRepository<History>) {
    super();
  }

  protected async next(props: CreateHistoryProps): Promise<E.Either<void, void>> {
    this.start();
    const history = History.create(props);
    const result = await this.historyRepository.save(history);
    result.mapRight((history) => this.bus.publish(new HistoryCreatedEvent(history)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
