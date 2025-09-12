import { Exception } from '@shared/domain';

export class RaffleRemoveException extends Exception {
  constructor() {
    super('errors.raffleRemoveNotAllowed');
  }
}

export class RaffleUpdateException extends Exception {
  constructor() {
    super('errors.raffleEditNotAllowed');
  }
}
