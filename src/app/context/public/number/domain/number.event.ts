import { Raffle } from '@context/shared/domain';
import { DomainEvent } from '@shared/domain';

export class BuyNumberEvent extends DomainEvent {
  constructor(
    public readonly raffle: Raffle,
    public readonly value: number,
  ) {
    super();
  }
}
