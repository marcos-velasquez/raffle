import * as E from '@sweet-monads/either';
import { Exception } from '../exception/base.exception';
import { object } from '../utilities';

export class Transaction<T extends object> {
  private readonly initialState: T;

  constructor(private readonly target: T) {
    this.initialState = object.clone(target);
  }

  public async run<R>(doAction: () => Promise<E.Either<Exception, R>>): Promise<E.Either<Exception, R>> {
    const result = await doAction();
    result.mapLeft(() => Object.assign(this.target, this.initialState));
    return result;
  }
}

export const transaction = <T extends object>(target: T) => new Transaction<T>(target);
