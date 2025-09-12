import * as E from '@sweet-monads/either';
import { PocketbaseAuthenticationService } from '../infrastructure/authentication.service';
import { LogoutUseCase } from './Logout/Logout.usecase';
import { LoginUseCase, LoginUseCaseProps } from './Login/Login.usecase';

export class AuthenticationFacade {
  private readonly authenticationService = new PocketbaseAuthenticationService();

  public login(props: LoginUseCaseProps): Promise<E.Either<void, void>> {
    return new LoginUseCase(this.authenticationService).execute(props);
  }

  public logout(): Promise<E.Either<void, void>> {
    return new LogoutUseCase(this.authenticationService).execute();
  }
}

export const authenticationFacade = new AuthenticationFacade();
