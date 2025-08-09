import { Raffle } from '@context/shared/domain';
import { DomainEvent } from '@shared/domain';

export class PaymentDeclinedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle, public readonly value: number) {
    super();
  }
}

export class PaymentVerifiedEvent extends DomainEvent {
  constructor(public readonly raffle: Raffle, public readonly value: number) {
    super();
  }
}
