import { bus, is, RequestFailedEvent, RequestStartedEvent, RequestSuccessfulEvent } from '@shared/domain';

export class UseCaseProgress {
  constructor(
    private readonly startValue: string,
    private readonly completeValue: string | Error,
  ) {}

  public start(): void {
    is.affirmative(this.has.start).mapRight(() => {
      bus.publish(new RequestStartedEvent(this.startValue));
    });
  }

  public complete(): void {
    is.error(this.completeValue)
      .mapRight(() => {
        bus.publish(new RequestFailedEvent(this.completeValue as Error));
      })
      .mapLeft(() => {
        bus.publish(new RequestSuccessfulEvent(this.completeValue as string));
      });
  }

  private get has() {
    return {
      start: this.startValue !== '',
      complete: this.completeValue !== '',
    };
  }

  public static from({ start, complete }: { start: string; complete: string | Error }): UseCaseProgress {
    return new UseCaseProgress(start, complete);
  }

  public static startFor(value: string): UseCaseProgress {
    return new UseCaseProgress(value, '');
  }

  public static completeFor(value: string | Error): UseCaseProgress {
    return new UseCaseProgress('', value);
  }

  public static empty() {
    return new UseCaseProgress('', '');
  }
}
