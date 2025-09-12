import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { FullPathPipe } from '@shared/presenter';
import { NumberDetailsComponent, RaffleDetailsComponent } from '@context/shared/presenter';
import { HistoryStore } from '@context/public/history/infrastructure';
import { DeliveryReceiptComponent } from '@context/admin/history/presenter';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    TranslocoPipe,
    FullPathPipe,
    RaffleDetailsComponent,
    NumberDetailsComponent,
    DeliveryReceiptComponent,
  ],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  public readonly historyId = input.required<string>();
  public readonly store = inject(HistoryStore);

  public readonly history = computed(() => this.store.get(this.historyId()));
}
