import { computed, inject } from '@angular/core';
import { UserStore } from '@context/admin/authentication/infrastructure';
import { ConfigStore } from '@context/shared/infrastructure';
import { BaseComponent as SharedBaseComponent } from '@shared/presenter';

export class BaseComponent extends SharedBaseComponent {
  private readonly configStore = inject(ConfigStore);
  protected readonly config = computed(() => this.configStore.config());

  private readonly userStore = inject(UserStore);
  protected readonly isAdmin = computed(() => this.userStore.user().is.admin.isRight());
}
