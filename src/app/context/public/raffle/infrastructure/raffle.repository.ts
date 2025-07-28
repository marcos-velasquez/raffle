import { Injectable } from '@angular/core';
import { Collections } from '@pocketbase';
import { PocketbaseRepository } from '@shared/infrastructure';
import { Raffle, RafflePrimitives } from '@context/shared/domain/raffle';

@Injectable({ providedIn: 'root' })
export class PocketbaseRaffleRepository extends PocketbaseRepository<Raffle, RafflePrimitives> {
  constructor() {
    super({ collection: Collections.Raffles, mapper: Raffle.from });
  }
}
