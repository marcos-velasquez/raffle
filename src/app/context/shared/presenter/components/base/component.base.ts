import { computed, inject } from '@angular/core';
import { UserStore } from '@context/admin/authentication/infrastructure';
import { ConfigStore } from '@context/shared/infrastructure';
import { BaseComponent as SharedBaseComponent } from '@shared/presenter';

export class BaseComponent extends SharedBaseComponent {
  protected readonly configStore = inject(ConfigStore);

  private readonly userStore = inject(UserStore);
  protected readonly isAdmin = computed(() => this.userStore.user().is.admin.isRight());
}
