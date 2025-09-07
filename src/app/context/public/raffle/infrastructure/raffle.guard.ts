import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { is } from '@shared/domain';
import { RaffleStore } from './raffle.store';

export function redirectRaffleNotFoundTo(redirect: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const raffleId = route.paramMap.get('raffleId') as string;
    return is
      .affirmative(inject(RaffleStore).has(raffleId))
      .mapRight(() => true)
      .mapLeft(() => inject(Router).createUrlTree([redirect])).value;
  };
}
