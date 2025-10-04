import { DomainEvent } from '@shared/domain';
import { Channel } from '@context/shared/domain';

export class ChannelCreatedEvent extends DomainEvent {
  constructor(public readonly channel: Channel) {
    super();
  }
}

export class ChannelUpdatedEvent extends DomainEvent {
  constructor(public readonly channel: Channel) {
    super();
  }
}

export class ChannelRemovedEvent extends DomainEvent {
  constructor(public readonly channel: Channel) {
    super();
  }
}
