import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { is } from '@shared/domain';
import { HistoryStore } from './history.store';

export function redirectHistoryNotFoundTo(redirect: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const historyId = route.paramMap.get('historyId') as string;
    return is
      .affirmative(inject(HistoryStore).has(historyId))
      .mapRight(() => true)
      .mapLeft(() => inject(Router).createUrlTree([redirect])).value;
  };
}
