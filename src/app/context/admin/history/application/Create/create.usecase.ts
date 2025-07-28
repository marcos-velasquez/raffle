import * as E from '@sweet-monads/either';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { History, HistoryCreatePrimitives } from '@context/admin/history/domain/history';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { HistoryCreatedEvent } from '../../domain';

export class CreateHistoryUseCase extends AdminUseCase<HistoryCreatePrimitives, Promise<E.Either<void, void>>> {
  constructor(private readonly historyRepository: BaseRepository<History>) {
    super();
  }

  protected async next(primitives: HistoryCreatePrimitives): Promise<E.Either<void, void>> {
    this.start();
    const history = History.create(primitives);
    const result = await this.historyRepository.save(history);
    result.mapRight((history) => this.bus.publish(new HistoryCreatedEvent(history)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
