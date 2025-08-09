import { Exception } from '@shared/domain';

export class RaffleRemoveException extends Exception {
  constructor() {
    super('Not allowed to remove a raffle with purchases');
  }
}

export class RaffleEditException extends Exception {
  constructor() {
    super('Not allowed to edit a raffle with purchases');
  }
}
