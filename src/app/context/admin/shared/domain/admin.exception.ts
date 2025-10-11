import { Exception } from '@shared/domain';

export class UnauthorizedException extends Exception {
  constructor() {
    super('errors.unauthorized');
  }
}
