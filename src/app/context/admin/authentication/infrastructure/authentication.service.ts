import * as E from '@sweet-monads/either';
import { pb } from '@shared/infrastructure';
import { bus, EitherBuilder } from '@shared/domain';
import { Credential, User, AuthenticationService, UserLoggedIn, UserLoggedOut } from '../domain';

export class PocketbaseAuthenticationService implements AuthenticationService {
  constructor() {
    if (pb.authStore.isValid && pb.authStore.record) {
      bus.publish(new UserLoggedIn(User.from({ email: pb.authStore.record['email'], id: pb.authStore.record.id })));
    } else {
      bus.publish(new UserLoggedOut());
    }
  }

  public async login(credential: Credential): Promise<E.Either<Error, User>> {
    try {
      const result = await pb.collection('_superusers').authWithPassword(credential.email, credential.password);
      return E.right(User.from({ email: result.record.email, id: result.record.id }));
    } catch (error) {
      return E.left(error as Error);
    }
  }

  public async logout(): Promise<E.Either<Error, void>> {
    try {
      return E.right(pb.authStore.clear());
    } catch (error) {
      return E.left(error as Error);
    }
  }
}

export const auth = {
  is: {
    admin: new EitherBuilder().fromRightBoolean(pb.authStore.isValid).build(),
  },
};
