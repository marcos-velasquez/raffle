import * as E from '@sweet-monads/either';
import { PocketbaseAuthenticationService } from '../infrastructure/authentication.service';
import { LogoutUseCase } from './Logout';
import { LoginUseCase, LoginProps } from './Login';

export class AuthenticationFacade {
  private readonly authenticationService = new PocketbaseAuthenticationService();

  public login(props: LoginProps): Promise<E.Either<void, void>> {
    return new LoginUseCase(this.authenticationService).execute(props);
  }

  public logout(): Promise<E.Either<void, void>> {
    return new LogoutUseCase(this.authenticationService).execute();
  }
}

export const authenticationFacade = new AuthenticationFacade();
