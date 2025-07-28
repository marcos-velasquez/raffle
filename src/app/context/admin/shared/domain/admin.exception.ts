export class UnauthorizedException extends Error {
  constructor() {
    super('No posee permisos para realizar esta acción.');
  }
}
