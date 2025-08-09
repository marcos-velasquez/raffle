export class Exception extends Error {
  public readonly params: object;

  constructor(message: string, params: object = {}) {
    super(message);
    this.params = params;
  }

  public static from(error: Error) {
    return new Exception(error.message);
  }
}
