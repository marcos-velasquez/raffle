import * as E from '@sweet-monads/either';
import { Credential } from './credential.model';
import { User } from './user.model';

export interface AuthenticationService {
  login(credential: Credential): Promise<E.Either<Error, User>>;
  logout(): Promise<E.Either<Error, void>>;
}
