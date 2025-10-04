import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Channel, ChannelPrimitives } from '../domain';

@Injectable({ providedIn: 'root' })
export class PocketbaseChannelRepository extends PocketbaseRepository<Channel, ChannelPrimitives> {
  constructor() {
    super({ collection: Collections.Channels, mapper: Channel.from });
  }
}
