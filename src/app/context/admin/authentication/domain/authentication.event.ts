import { DomainEvent } from '@shared/domain/event/base.event';
import { User } from './user.model';

export class UserLoggedIn extends DomainEvent {
  constructor(public readonly user: User) {
    super();
  }
}

export class UserLoggedOut extends DomainEvent {
  constructor() {
    super();
  }
}
