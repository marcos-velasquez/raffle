import * as E from '@sweet-monads/either';
import { UseCase } from '@shared/application';
import { EitherBuilder } from '@shared/domain';
import { AuthenticationService, UserLoggedOut } from '../../domain';

export class LogoutUseCase extends UseCase<void, Promise<E.Either<void, void>>> {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  public async execute(): Promise<E.Either<void, void>> {
    const result = await this.authenticationService.logout();
    result.mapRight(() => this.bus.publish(new UserLoggedOut()));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
