import { BaseRepository } from '@shared/domain';
import { PocketbaseHistoryRepository } from '../infrastructure/history.repository';
import { CreateHistoryUseCaseProps, CreateHistoryUseCase } from './Create/create.usecase';
import { UpdateHistoryUseCase, UpdaterHistoryUseCaseProps } from './Update/update.usecase';
import { HistoryCreator, HistoryUpdater } from '../domain';

export class HistoryFacade {
  private readonly historyRepository = new PocketbaseHistoryRepository();

  public create(primitives: CreateHistoryUseCaseProps): void {
    new CreateHistoryUseCase(this.historyRepository as BaseRepository<HistoryCreator>).execute(primitives);
  }

  public update(primitives: UpdaterHistoryUseCaseProps): void {
    new UpdateHistoryUseCase(this.historyRepository as BaseRepository<HistoryUpdater>).execute(primitives);
  }
}

export const historyFacade = new HistoryFacade();
