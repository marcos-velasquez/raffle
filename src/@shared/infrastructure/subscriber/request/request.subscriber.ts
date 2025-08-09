import { Injectable, inject } from '@angular/core';
import { LoadingBarService } from '@ui/services/loading';
import { RequestStartedEvent, RequestSuccessfulEvent, RequestFailedEvent } from '@shared/domain';
import { LoaderStore } from '../../store/loader/loader.store';
import { ToastService } from '../../services';
import { BaseSubscriber } from '../base.subscriber';

@Injectable({ providedIn: 'root' })
export class RequestSubscriber extends BaseSubscriber {
  private readonly loaderStore = inject(LoaderStore);
  private readonly loadingBarService = inject(LoadingBarService);
  private readonly toastService = inject(ToastService);

  protected listen() {
    this.bus.on(RequestStartedEvent).subscribe(({ message }) => {
      this.toastService.wait(message);
      this.loadingBarService.enable();
      this.loaderStore.enable();
    });

    this.bus.on(RequestSuccessfulEvent).subscribe(({ message }) => {
      this.finish();
      this.toastService.success(message);
    });

    this.bus.on(RequestFailedEvent).subscribe(({ exception }) => {
      this.finish();
      this.toastService.error(exception);
    });
  }

  private finish() {
    this.toastService.disable();
    this.loadingBarService.disable();
    this.loaderStore.disable();
  }
}
