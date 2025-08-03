import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingBarService {
  public readonly active$ = new BehaviorSubject<boolean>(false);

  public disable(): void {
    this.active$.next(true);
  }

  public enable(): void {
    this.active$.next(false);
  }
}
