import { DomainEvent } from '@shared/domain';
import { Configuration } from './configuration';

export class ConfigurationCreatedEvent extends DomainEvent {
  constructor(public readonly configuration: Configuration) {
    super();
  }
}

export class ConfigurationUpdatedEvent extends DomainEvent {
  constructor(public readonly configuration: Configuration) {
    super();
  }
}

export class ConfigurationRemovedEvent extends DomainEvent {
  constructor(public readonly configuration: Configuration) {
    super();
  }
}
