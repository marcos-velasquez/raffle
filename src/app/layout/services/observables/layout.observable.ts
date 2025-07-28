import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { ConfigService, UiConfig } from '@ui/services/config';

@Injectable({ providedIn: 'root' })
export class LayoutObservable {
  public readonly change$: Observable<UiConfig>;

  constructor(configService: ConfigService, router: Router) {
    this.change$ = combineLatest([
      configService.config$,
      router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    ]).pipe(map(([config]) => config));
  }
}
