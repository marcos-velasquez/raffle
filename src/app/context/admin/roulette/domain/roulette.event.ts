import { DomainEvent } from '@shared/domain';
import { Raffle } from '@context/shared/domain';

export class WinnerSelectedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle) {
    super();
  }
}
