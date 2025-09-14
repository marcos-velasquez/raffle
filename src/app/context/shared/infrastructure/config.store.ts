import { inject } from '@angular/core';
import { signalStore, withState, patchState, withHooks } from '@ngrx/signals';
import { Config } from '../domain';
import { PocketbaseConfigRepository } from './config.repository';

type ConfigState = {
  config: Config;
};

const initialState: ConfigState = {
  config: Config.empty(),
};

export const ConfigStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks((store, repository = inject(PocketbaseConfigRepository)) => ({
    onInit() {
      repository.findOne().then((result) => {
        result.mapRight((config) => patchState(store, { config }));
      });
    },
  }))
);
