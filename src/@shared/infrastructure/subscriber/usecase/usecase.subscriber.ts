import { Injectable } from '@angular/core';
import { UseCaseFailedEvent, UseCaseSuccessfulEvent } from '@shared/domain';
import { ToastService } from '../../services';
import { BaseSubscriber } from '../base.subscriber';

@Injectable({ providedIn: 'root' })
export class UseCaseSubscriber extends BaseSubscriber {
  constructor(private readonly toastService: ToastService) {
    super();
  }

  protected listen(): void {
    this.bus.on(UseCaseFailedEvent).subscribe(({ message }) => this.toastService.error(message));
    this.bus.on(UseCaseSuccessfulEvent).subscribe(({ message }) => this.toastService.success(message));
  }
}
