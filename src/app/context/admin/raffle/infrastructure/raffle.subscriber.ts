import { inject, Injectable } from '@angular/core';
import { bus } from '@shared/domain';
import { BaseSubscriber } from '@shared/infrastructure';
import { RaffleCreatedEvent, RaffleUpdatedEvent, RaffleRemovedEvent } from '../domain';
import { RaffleStore } from './raffle.store';

@Injectable({ providedIn: 'root' })
export class RaffleSubscriber extends BaseSubscriber {
  private readonly store = inject(RaffleStore);

  protected listen(): void {
    bus.on(RaffleCreatedEvent).subscribe(({ raffle }) => this.store.insert(raffle));
    bus.on(RaffleRemovedEvent).subscribe(({ raffle }) => this.store.remove(raffle));
    bus.on(RaffleUpdatedEvent).subscribe(({ raffle }) => this.store.update(raffle));
  }
}
