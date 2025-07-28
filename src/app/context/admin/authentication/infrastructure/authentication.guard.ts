import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, UnaryFunction, of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { pb } from '@shared/infrastructure';

export type AuthPipeGenerator = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe;
export type AuthPipe = UnaryFunction<Observable<boolean | null>, Observable<boolean | string | any[]>>;

export const loggedIn: AuthPipe = map((valid) => !!valid);

@Injectable({ providedIn: 'any' })
export class PocketbaseAuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authPipeFactory = (next.data['authGuardPipe'] as AuthPipeGenerator) || (() => loggedIn);
    return of(pb.authStore.isValid).pipe(
      authPipeFactory(next, state),
      map((can) => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          return this.router.parseUrl(can);
        }
      })
    );
  };
}

export const canActivate = (pipe: AuthPipeGenerator) => ({
  canActivate: [PocketbaseAuthGuard],
  data: { authGuardPipe: pipe },
});

export const redirectUnauthorizedTo: (redirect: string | any[]) => AuthPipe = (redirect) =>
  pipe(
    loggedIn,
    map((loggedIn) => loggedIn || redirect)
  );

export const redirectLoggedInTo: (redirect: string | any[]) => AuthPipe = (redirect) =>
  pipe(
    loggedIn,
    map((loggedIn) => (loggedIn ? redirect : true))
  );
