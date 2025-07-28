import { DomainEvent } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';

export class RaffleCreatedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle) {
    super();
  }
}

export class RaffleEditedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle) {
    super();
  }
}

export class RaffleRemovedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle) {
    super();
  }
}
