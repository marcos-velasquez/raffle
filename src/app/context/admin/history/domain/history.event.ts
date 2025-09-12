import { DomainEvent } from '@shared/domain';
import { HistoryCreator } from './history-creator';
import { HistoryUpdater } from './history-updater';

export class HistoryCreatedEvent extends DomainEvent {
  constructor(public readonly history: HistoryCreator) {
    super();
  }
}

export class HistoryUpdatedEvent extends DomainEvent {
  constructor(public readonly history: HistoryUpdater) {
    super();
  }
}
