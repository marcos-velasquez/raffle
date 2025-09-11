import { DomainEvent } from '@shared/domain';
import { HistoryCreator } from './history-creator';

export class HistoryCreatedEvent extends DomainEvent {
  constructor(public readonly history: HistoryCreator) {
    super();
  }
}
