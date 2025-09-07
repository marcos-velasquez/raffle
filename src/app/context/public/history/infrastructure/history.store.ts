import { inject } from '@angular/core';
import { signalStore, withState, patchState, withHooks, withMethods } from '@ngrx/signals';
import { PocketbaseHistoryRepository } from './history.repository';
import { History } from '../domain';

type HistoryState = {
  histories: History[];
};

const initialState: HistoryState = {
  histories: [],
};

export const HistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks((store, repository = inject(PocketbaseHistoryRepository)) => ({
    onInit() {
      repository.findAll().then((result) => result.mapRight((histories) => patchState(store, { histories })));
      repository.valuesChange().subscribe((histories) => patchState(store, { histories }));
    },
  })),
  withMethods((store) => ({
    has(id: string) {
      return store.histories().some((h) => h.equal(id));
    },
    get(id: string) {
      return store.histories().find((h) => h.equal(id));
    },
  }))
);
