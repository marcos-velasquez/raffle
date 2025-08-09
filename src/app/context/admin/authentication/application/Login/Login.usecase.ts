import * as E from '@sweet-monads/either';
import { EitherBuilder } from '@shared/domain';
import { UseCase, progressBuilder } from '@shared/application';
import { AuthenticationService, Credential, UserLoggedIn } from '../../../authentication/domain';

export type LoginProps = { email: string; password: string };

export class LoginUseCase extends UseCase<LoginProps, Promise<E.Either<void, void>>> {
  constructor(private readonly authenticationService: AuthenticationService) {
    super(progressBuilder().withStart('progress.validatingCredentials').withComplete('progress.loginSuccess').build());
  }

  public async execute(props: LoginProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.authenticationService.login(Credential.from(props));
    result.mapRight((user) => this.bus.publish(new UserLoggedIn(user)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
