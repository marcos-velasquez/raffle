import { inject } from '@angular/core';
import { Raffle } from '@context/shared/domain/raffle';
import { signalStore, withState, patchState, withMethods, withHooks } from '@ngrx/signals';
import { RaffleCriteria } from '../domain/raffle.criteria';
import { PocketbaseRaffleRepository } from './raffle.repository';

type RaffleState = {
  raffles: Raffle[];
};

const initialState: RaffleState = {
  raffles: [],
};

export const RaffleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks((store, repository = inject(PocketbaseRaffleRepository)) => ({
    onInit() {
      repository.valuesChange().subscribe((raffle) => {
        patchState(store, { raffles: [raffle] });
      });
    },
  })),
  withMethods((store, repository = inject(PocketbaseRaffleRepository)) => ({
    switchAvailable() {
      repository.findAll(RaffleCriteria.available()).then((result) => {
        result.mapRight((raffles) => patchState(store, { raffles }));
      });
    },
    has(id: string) {
      return store.raffles().some((r) => r.getId() === id);
    },
    get(id: string) {
      return store.raffles().find((r) => r.getId() === id);
    },
  }))
);
