import { inject, Injectable } from '@angular/core';
import { BaseSubscriber } from '@shared/infrastructure';
import { UserLoggedIn, UserLoggedOut } from '../domain/authentication.event';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class AuthenticationSubscriber extends BaseSubscriber {
  private readonly store = inject(UserStore);

  protected listen(): void {
    this.bus.on(UserLoggedIn).subscribe(({ user }) => this.store.set(user));
    this.bus.on(UserLoggedOut).subscribe(() => this.store.reset());
  }
}
