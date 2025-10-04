import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastService } from '@shared/infrastructure';
import { when } from '@shared/domain';
import { BaseComponent, ChannelFullPathPipe } from '@context/shared/presenter';
import { Channel } from '@context/shared/domain';

@Component({
  selector: 'app-payment-details',
  imports: [CommonModule, TranslocoPipe, ChannelFullPathPipe],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  templateUrl: './payment-details.component.html',
})
export class PaymentDetailsComponent extends BaseComponent {
  private readonly toast = inject(ToastService);

  public copyToClipboard(channel: Channel): void {
    when(navigator.clipboard.writeText(channel.details)).mapRight(() => {
      this.toast.success('messages.copiedToClipboard');
    });
  }
}
