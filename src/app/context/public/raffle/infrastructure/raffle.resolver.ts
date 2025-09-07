import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleStore } from './raffle.store';

export const raffleResolver: ResolveFn<Raffle> = (route) => {
  const store = inject(RaffleStore);
  return new Proxy({} as Raffle, {
    get(_, prop) {
      return store.get(route.paramMap.get('id'))?.[prop];
    },
  });
};
