import { Component, inject, signal } from '@angular/core';
import { BaseComponent } from '@core/base';
import { LoadingBarService } from '../../services/loading/loading.service';

@Component({
  selector: 'ui-loading-bar',
  templateUrl: './loading-bar.component.html',
  styles: [':host { width: 100%; display: flex; position: fixed; top: 0; z-index: 999;}'],
})
export class LoadingBarComponent extends BaseComponent {
  public readonly isEnable = signal<boolean>(true);

  constructor() {
    super();
    inject(LoadingBarService)
      .active$.pipe(this.unsubscribe())
      .subscribe((value) => this.isEnable.set(value));
  }
}
