import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Config, ConfigPrimitives } from '@context/shared/domain/config';

@Injectable({ providedIn: 'root' })
export class PocketbaseConfigRepository extends PocketbaseRepository<Config, ConfigPrimitives> {
  constructor() {
    super({ collection: Collections.Config, mapper: Config.from });
  }
}
