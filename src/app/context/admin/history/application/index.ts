import { PocketbaseHistoryRepository } from '../infrastructure/history.repository';
import { CreateHistoryUseCaseProps, CreateHistoryUseCase } from './Create/create.usecase';
import { EditHistoryUseCase, UpdaterHistoryUseCaseProps } from './Edit/edit.usecase';

export class HistoryFacade {
  private readonly historyRepository = new PocketbaseHistoryRepository();

  public create(primitives: CreateHistoryUseCaseProps): void {
    new CreateHistoryUseCase(this.historyRepository).execute(primitives);
  }

  public update(primitives: UpdaterHistoryUseCaseProps): void {
    new EditHistoryUseCase(this.historyRepository).execute(primitives);
  }
}

export const historyFacade = new HistoryFacade();
