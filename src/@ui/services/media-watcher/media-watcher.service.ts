import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaWatcherService {
  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  public mediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this.breakpointObserver.observe(query);
  }
}
