import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain';
import { UseCaseProgress } from './models';

export abstract class UseCase<T, K> {
  protected readonly bus = bus;

  constructor(private readonly progress = UseCaseProgress.empty()) {}

  protected start(): void {
    this.progress.start();
  }

  protected complete(result: E.Either<Error, unknown>): void {
    result.mapLeft((error) => UseCaseProgress.completeFor(error).complete());
    result.mapRight(() => this.progress.complete());
  }

  abstract execute(arg: T): K;
}
