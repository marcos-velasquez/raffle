export abstract class BaseMapper<T, K> {
  public fromDomain(domain: T): K | T {
    return domain;
  }

  public toDomain(model: K): T | K {
    return model;
  }
}
