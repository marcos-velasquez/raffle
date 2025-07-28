export abstract class Notification<T> {
  constructor(protected readonly props: T) {}

  public abstract send(): Promise<void>;
}
