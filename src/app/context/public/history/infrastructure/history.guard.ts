import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { is } from '@shared/domain';
import { HistoryStore } from './history.store';

export function redirectHistoryNotFoundTo(redirect: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const historyId = route.paramMap.get('historyId') as string;
    const store = inject(HistoryStore);
    const router = inject(Router);

    return toObservable(store.isLoading).pipe(
      filter((isLoading) => !isLoading),
      take(1),
      map(() => {
        return is
          .affirmative(store.has(historyId))
          .mapRight(() => true)
          .mapLeft(() => router.createUrlTree([redirect])).value;
      })
    );
  };
}
