import { DomainEvent } from '../base.event';

export class UseCaseFailedEvent extends DomainEvent {
  constructor(public readonly message: string) {
    super();
  }
}
