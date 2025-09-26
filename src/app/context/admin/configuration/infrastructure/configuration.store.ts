import { inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods, withHooks } from '@ngrx/signals';
import { Configuration } from '../domain';
import { PocketbaseConfigurationRepository } from './configuration.repository';

type ConfigurationState = {
  configurations: Configuration[];
};

const initialState: ConfigurationState = {
  configurations: [],
};

export const ConfigurationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks((store, repository = inject(PocketbaseConfigurationRepository)) => ({
    onInit() {
      repository.findAll().then((result) => {
        result.mapRight((configurations) => patchState(store, { configurations }));
      });
      repository.valuesChange().subscribe((configurations) => patchState(store, { configurations }));
    },
  })),
  withMethods((store) => ({
    insert(configuration: Configuration) {
      patchState(store, (state) => ({ configurations: [...state.configurations, configuration] }));
    },
    remove(configuration: Configuration) {
      patchState(store, (state) => ({
        configurations: state.configurations.filter((c) => c.getId() !== configuration.getId()),
      }));
    },
    update(configuration: Configuration) {
      patchState(store, (state) => ({
        configurations: state.configurations.map((c) => (c.getId() === configuration.getId() ? configuration : c)),
      }));
    },
  }))
);
