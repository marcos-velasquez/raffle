import * as E from '@sweet-monads/either';

export const isBrowser = () => typeof window !== 'undefined';
export const isServer = () => !isBrowser();
export const availableWindow = (): E.Either<Error, Window> => {
  if (isBrowser()) {
    return E.right(window);
  } else {
    return E.left(new Error('Window not supported'));
  }
};
