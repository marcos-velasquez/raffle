import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Configuration, ConfigurationPrimitives } from '../domain';

@Injectable({ providedIn: 'root' })
export class PocketbaseConfigurationRepository extends PocketbaseRepository<Configuration, ConfigurationPrimitives> {
  constructor() {
    super({ collection: Collections.Configuration, mapper: Configuration.from });
  }
}
