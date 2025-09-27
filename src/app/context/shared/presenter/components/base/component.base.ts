import { computed, inject } from '@angular/core';
import { UserStore } from '@context/admin/authentication/infrastructure';
import { ConfigurationStore } from '@context/shared/infrastructure';
import { BaseComponent as SharedBaseComponent } from '@shared/presenter';

export class BaseComponent extends SharedBaseComponent {
  private readonly configStore = inject(ConfigurationStore);
  protected readonly configurations = computed(() => this.configStore.configurations());

  private readonly userStore = inject(UserStore);
  protected readonly isAdmin = computed(() => this.userStore.user().is.admin.isRight());
}
