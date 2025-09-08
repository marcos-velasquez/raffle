import * as E from '@sweet-monads/either';
import { $is } from '../utilities';

export class EitherBuilder<T = undefined, K = undefined> {
  private left: T | null = null;
  private right: K | null = null;
  private error: Error | null = null;

  public setLeft(value: T): this {
    this.left = value;
    return this;
  }

  public setRight(value: K): this {
    this.right = value;
    return this;
  }

  public setError(error: Error): this {
    this.error = error;
    return this;
  }

  public fromLeftBoolean(value: unknown, left?: T, right?: K): this {
    if (value) {
      return this.setLeft(left as T);
    } else {
      return this.setRight(right as K);
    }
  }

  public fromRightBoolean(value: unknown, left?: T, right?: K): this {
    return this.fromLeftBoolean(!value, left, right);
  }

  public fromLeftCallback(value: unknown, left: () => T, right: () => K = () => undefined as K): this {
    if (value) {
      return this.setLeft(left());
    } else {
      return this.setRight(right());
    }
  }

  public fromRightCallback(value: unknown, right: () => K, left: () => T = () => undefined as T): this {
    return this.fromLeftCallback(!value, left, right);
  }

  public fromEitherToVoid(either: E.Either<unknown, unknown>): this {
    if (either.isRight()) {
      return this.setRight(undefined as K);
    } else {
      return this.setLeft(undefined as T);
    }
  }

  public fromEitherToEither(either: E.Either<unknown, unknown>): this {
    if (either.isRight()) {
      return this.setRight(either.value as K);
    } else {
      return this.setLeft(either.value as T);
    }
  }

  public fromValueToEither(value: unknown): this {
    if (value) {
      return this.setRight(value as K);
    } else {
      return this.setLeft(value as T);
    }
  }

  public fromErrorToVoid(either: E.Either<Error, unknown>): this {
    if (either.value instanceof Error) {
      return this.setLeft(either.value as T);
    } else {
      return this.setRight(either.value as K);
    }
  }

  public build(): E.Either<T, K> {
    if (this.error !== null) {
      return E.left(this.error as T);
    }

    if (this.left !== null) {
      return E.left(this.left);
    }

    if (this.right !== null) {
      return E.right(this.right);
    }

    return E.right(undefined as K);
  }
}

export * as E from '@sweet-monads/either';
export const when = <T>(value: T) => new EitherBuilder<void, T>().setRight(value).build();
export const has = (value: unknown) => new EitherBuilder().fromRightBoolean(!!value).build();
export const is = {
  undefined: (value: unknown) => new EitherBuilder().fromLeftBoolean($is.undefined(value)).build(),
  affirmative: (value: unknown) => new EitherBuilder().fromRightBoolean($is.affirmative(value)).build(),
  error: (value: unknown) => new EitherBuilder().fromRightBoolean($is.error(value)).build(),
  empty: (value: unknown) => new EitherBuilder().fromRightBoolean($is.empty(value)).build(),
  nil: (value: unknown) => new EitherBuilder().fromRightBoolean($is.nil(value)).build(),
  string: (value: unknown) => new EitherBuilder().fromRightBoolean($is.string(value)).build(),
  number: (value: unknown) => new EitherBuilder().fromRightBoolean($is.number(value)).build(),
  boolean: (value: unknown) => new EitherBuilder().fromRightBoolean($is.boolean(value)).build(),
  array: (value: unknown) => new EitherBuilder().fromRightBoolean($is.array(value)).build(),
};
