import { DomainEvent } from '@shared/domain';
import { History } from './history';

export class HistoryCreatedEvent extends DomainEvent {
  constructor(public readonly history: History) {
    super();
  }
}
