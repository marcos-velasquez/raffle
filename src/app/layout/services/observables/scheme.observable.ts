import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ConfigService, Scheme, scheme } from '@ui/services/config';
import { MediaWatcherService } from '@ui/services/media-watcher';

@Injectable({ providedIn: 'root' })
export class SchemeObservable {
  public readonly change$: Observable<Scheme>;

  constructor(configService: ConfigService, mediaWatcherService: MediaWatcherService) {
    const query = ['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'];
    this.change$ = combineLatest([configService.config$, mediaWatcherService.mediaQueryChange$(query)]).pipe(
      map(([config, mql]) => {
        scheme(config.scheme).is.auto.mapRight(() => {
          config.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? Scheme.DARK : Scheme.LIGHT;
        });
        return config.scheme;
      })
    );
  }
}
