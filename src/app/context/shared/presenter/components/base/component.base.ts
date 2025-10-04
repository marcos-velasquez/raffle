import { computed, inject } from '@angular/core';
import { UserStore } from '@context/admin/authentication/infrastructure';
import { ChannelStore } from '@context/shared/infrastructure';
import { BaseComponent as SharedBaseComponent } from '@shared/presenter';

export class BaseComponent extends SharedBaseComponent {
  public readonly channelStore = inject(ChannelStore);
  protected readonly channel = computed(() => this.channelStore.selected());

  public readonly userStore = inject(UserStore);
  protected readonly isAdmin = computed(() => this.userStore.user().is.admin.isRight());
}
