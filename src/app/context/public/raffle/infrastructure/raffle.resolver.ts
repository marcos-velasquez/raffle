import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { when } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleStore } from './raffle.store';

export const raffleResolver: ResolveFn<Raffle> = (route) => {
  return when(route.paramMap.get('id')).map((id) => inject(RaffleStore).get(id)).value as Raffle;
};
