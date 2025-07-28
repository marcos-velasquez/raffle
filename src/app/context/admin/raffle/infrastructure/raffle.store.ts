import { inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods, withHooks } from '@ngrx/signals';
import { Raffle } from '@context/shared/domain/raffle';
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
      repository.findAll(RaffleCriteria.available()).then((result) => {
        result.mapRight((raffles) => patchState(store, { raffles }));
      });
    },
  })),
  withMethods((store) => ({
    has(id: string) {
      return store.raffles().some((r) => r.getId() === id);
    },
    get(id: string) {
      return store.raffles().find((r) => r.getId() === id);
    },
    insert(raffle: Raffle) {
      patchState(store, (state) => ({ raffles: [...state.raffles, raffle] }));
    },
    remove(raffle: Raffle) {
      patchState(store, (state) => ({
        raffles: state.raffles.filter((r) => r.getId() !== raffle.getId()),
      }));
    },
    edit(raffle: Raffle) {
      patchState(store, (state) => ({
        raffles: state.raffles.map((r) => (r.getId() === raffle.getId() ? raffle : r)),
      }));
    },
  })),
);
