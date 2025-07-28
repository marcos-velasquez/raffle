import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { User } from '../domain';

type UserState = {
  user: User;
};

const initialState: UserState = {
  user: User.empty(),
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    isAdmin() {
      return store.user().is.admin;
    },
    set(user: User) {
      patchState(store, () => ({ user }));
    },
    reset() {
      this.set(User.empty());
    },
  })),
);
