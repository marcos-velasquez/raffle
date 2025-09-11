import { HistoryCreatorPrimitives } from '@context/admin/history/domain/history-creator';
import { PocketbaseHistoryRepository } from '../infrastructure/history.repository';
import { CreateHistoryUseCase } from './Create/create.usecase';

export class HistoryFacade {
  private readonly historyRepository = new PocketbaseHistoryRepository();

  public create(primitives: HistoryCreatorPrimitives): void {
    new CreateHistoryUseCase(this.historyRepository).execute(primitives);
  }
}

export const historyFacade = new HistoryFacade();
