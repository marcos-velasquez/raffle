import { IdFactory, object } from '@shared/domain';

export abstract class Entity<K> {
  private id: string;

  constructor(id?: string) {
    this.id = id ?? IdFactory.create();
  }

  public getId(): string {
    return this.id;
  }

  public equal(id: string): boolean {
    return this.id === id;
  }

  protected withId(id: string): this {
    this.id = id;
    return this;
  }

  public clone<T>(): T {
    return object.clone(this) as unknown as T;
  }

  public abstract toPrimitives(): K;
}
