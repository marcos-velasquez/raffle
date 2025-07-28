import { inject, Injectable } from '@angular/core';
import { SharedSubscriber, BaseSubscriber } from '@shared/infrastructure';
import { AuthenticationSubscriber } from '@context/admin/authentication/infrastructure';
import { NotificationSubscriber } from '@context/admin/notification/infrastructure';

@Injectable({ providedIn: 'root' })
export class AppSubscriber extends BaseSubscriber {
  private readonly sharedSubscriber = inject(SharedSubscriber);
  private readonly authenticationSubscriber = inject(AuthenticationSubscriber);
  private readonly notificationSubscriber = inject(NotificationSubscriber);

  public listen(): void {
    this.sharedSubscriber.init();
    this.authenticationSubscriber.init();
    this.notificationSubscriber.init();
  }
}
