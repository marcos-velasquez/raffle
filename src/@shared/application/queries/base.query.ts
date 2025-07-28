import * as E from '@sweet-monads/either';
import { bus, is, RequestFailedEvent } from '@shared/domain';

export abstract class Query<T, K> {
  private isActive = false;

  public isLoading(): boolean {
    return this.isActive;
  }

  protected start(): void {
    this.isActive = true;
  }

  protected complete(result: E.Either<Error, unknown>): void {
    this.isActive = false;
    is.error(result.value).mapRight(() => {
      bus.publish(new RequestFailedEvent(result.value as Error));
    });
  }

  abstract execute(arg: T): K;
}
