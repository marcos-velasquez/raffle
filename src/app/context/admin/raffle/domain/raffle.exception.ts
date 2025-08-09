import { Exception } from '@shared/domain';

export class RaffleRemoveException extends Exception {
  constructor() {
    super('errors.raffleRemoveNotAllowed');
  }
}

export class RaffleEditException extends Exception {
  constructor() {
    super('errors.raffleEditNotAllowed');
  }
}
