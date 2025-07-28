import { Injectable, inject } from '@angular/core';
import { LoadingBarService } from '@ui/services/loading';
import { RequestStartedEvent, RequestSuccessfulEvent, RequestFailedEvent } from '@shared/domain';
import { ToastService } from '../../services';
import { LoaderStore } from '../../store/loader/loader.store';
import { BaseSubscriber } from '../base.subscriber';

@Injectable({ providedIn: 'root' })
export class RequestSubscriber extends BaseSubscriber {
  private readonly loaderStore = inject(LoaderStore);
  private readonly loadingBarService = inject(LoadingBarService);
  private readonly toastService = inject(ToastService);

  protected listen() {
    this.bus.on(RequestStartedEvent).subscribe(({ message }) => {
      this.toastService.wait(message);
      this.loadingBarService.activate();
      this.loaderStore.activate();
    });

    this.bus.on(RequestSuccessfulEvent).subscribe(({ message }) => {
      this.finish();
      this.toastService.success(message);
    });

    this.bus.on(RequestFailedEvent).subscribe(({ error }) => {
      this.finish();
      this.toastService.error(error.message);
    });
  }

  private finish() {
    this.toastService.dismissWait();
    this.loadingBarService.deactivate();
    this.loaderStore.deactivate();
  }
}
