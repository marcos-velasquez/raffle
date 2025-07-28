import * as E from '@sweet-monads/either';
import { object } from '../utilities';

export class Transaction<T extends Object> {
  private readonly initialState: T;

  constructor(private readonly target: T) {
    this.initialState = object.clone(target);
  }

  public async run<R>(doAction: () => Promise<E.Either<Error, R>>): Promise<E.Either<Error, R>> {
    const result = await doAction();
    result.mapLeft(() => object.merge(this.target, this.initialState));
    return result;
  }
}

export const transaction = <T extends object>(target: T) => new Transaction<T>(target);
