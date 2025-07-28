import { DomainEvent } from '../base.event';

export class UseCaseSuccessfulEvent extends DomainEvent {
  constructor(public readonly message: string) {
    super();
  }
}
