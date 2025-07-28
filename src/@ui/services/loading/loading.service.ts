import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingBarService {
  public readonly active$ = new BehaviorSubject<boolean>(false);

  public activate(): void {
    this.active$.next(true);
  }

  public deactivate(): void {
    this.active$.next(false);
  }
}
