import * as E from '@sweet-monads/either';
import { UseCase } from '@shared/application';
import { auth } from '@context/admin/authentication/infrastructure';
import { UnauthorizedException } from '../domain/admin.exception';

export abstract class AdminUseCase<K, T> extends UseCase<K, void> {
  public execute(arg: K): void {
    auth.is.admin.mapRight(() => this.next(arg)).mapLeft(() => this.complete(E.left(new UnauthorizedException())));
  }

  protected abstract next(arg: K): T;
}
