import * as E from '@sweet-monads/either';
import { pb } from '@shared/infrastructure';
import { bus, EitherBuilder, Exception } from '@shared/domain';
import { Credential, User, AuthenticationService, UserLoggedIn, UserLoggedOut } from '../domain';

export class PocketbaseAuthenticationService implements AuthenticationService {
  constructor() {
    if (pb.authStore.isValid && pb.authStore.record) {
      bus.publish(new UserLoggedIn(User.from({ email: pb.authStore.record['email'], id: pb.authStore.record.id })));
    } else {
      bus.publish(new UserLoggedOut());
    }
  }

  public async login(credential: Credential): Promise<E.Either<Exception, User>> {
    try {
      const result = await pb.collection('_superusers').authWithPassword(credential.email, credential.password);
      return E.right(User.from({ email: result.record.email, id: result.record.id }));
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }

  public async logout(): Promise<E.Either<Exception, void>> {
    try {
      return E.right(pb.authStore.clear());
    } catch (error) {
      return E.left(Exception.from(error));
    }
  }
}

export const auth = {
  is: {
    admin: new EitherBuilder().fromRightBoolean(pb.authStore.isValid).build(),
  },
};
