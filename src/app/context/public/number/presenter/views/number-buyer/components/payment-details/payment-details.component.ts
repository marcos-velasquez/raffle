import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastService } from '@shared/infrastructure';
import { when } from '@shared/domain';

@Component({
  selector: 'app-payment-details',
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './payment-details.component.html',
})
export class PaymentDetailsComponent {
  private readonly toast = inject(ToastService);

  public copyToClipboard(): void {
    when(navigator.clipboard.writeText('Venezuela 123456789 04121112312')).mapRight(() => {
      this.toast.success('messages.copiedToClipboard');
    });
  }
}
