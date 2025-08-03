import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SplashScreenService {
  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        delay(100),
        take(1)
      )
      .subscribe(() => this.disable());
  }

  public enable(): void {
    this.document.body.classList.remove('splash-screen-hidden');
  }

  public disable(): void {
    this.document.body.classList.add('splash-screen-hidden');
  }
}
