import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@core/base';
import { UploaderComponent } from '@ui/components/uploader';
import { FullPathPipe } from '@shared/presenter';
import { History } from '@context/shared/domain';
import { historyFacade } from '@context/admin/history/application';

@Component({
  selector: 'app-delivery-receipt',
  imports: [CommonModule, TranslocoPipe, FullPathPipe, UploaderComponent],
  templateUrl: './delivery-receipt.component.html',
})
export class DeliveryReceiptComponent extends BaseComponent {
  public readonly history = input.required<History>();

  public update(file: File | File[]) {
    historyFacade.update({ history: this.history().toPrimitives(), deliveryReceipt: file as File });
  }
}
