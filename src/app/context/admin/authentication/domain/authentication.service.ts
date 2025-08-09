import * as E from '@sweet-monads/either';
import { Exception } from '@shared/domain';

import { Credential } from './credential.model';
import { User } from './user.model';

export interface AuthenticationService {
  login(credential: Credential): Promise<E.Either<Exception, User>>;
  logout(): Promise<E.Either<Exception, void>>;
}
