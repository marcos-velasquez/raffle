import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export type MediaChange = { matchingAliases: string[]; matchingQueries: Record<string, string> };

@Injectable({ providedIn: 'root' })
export class MediaWatcherService {
  public readonly mediaChange$ = new ReplaySubject<MediaChange>(1);

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  public mediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this.breakpointObserver.observe(query);
  }
}
