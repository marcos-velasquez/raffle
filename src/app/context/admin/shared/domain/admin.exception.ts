export class UnauthorizedException extends Error {
  constructor() {
    super('errors.unauthorized');
  }
}
