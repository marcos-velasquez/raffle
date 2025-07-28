import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';

type LoaderState = {
  isActive: boolean;
};

const initialState: LoaderState = {
  isActive: false,
};

export const LoaderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    activate() {
      patchState(store, () => ({ isActive: true }));
    },
    deactivate() {
      patchState(store, () => ({ isActive: false }));
    },
  }))
);
