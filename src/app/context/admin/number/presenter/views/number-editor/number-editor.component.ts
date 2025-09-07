import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationService } from '@ui/services/confirmation';
import { ExpandImageDirective } from '@ui/directives/expand-image';
import { RaffleDetailsComponent, NumberComponent, VoucherFullPathPipe } from '@context/shared/presenter';
import { RaffleStore } from '@context/admin/raffle/infrastructure';
import { numberFacade } from '../../../application';

@Component({
  selector: 'app-number-editor',
  imports: [
    CommonModule,
    TranslocoPipe,
    VoucherFullPathPipe,
    RaffleDetailsComponent,
    NumberComponent,
    ExpandImageDirective,
  ],
  templateUrl: './number-editor.component.html',
})
export class NumberEditorComponent {
  public readonly value = input.required<string>();
  public readonly raffleId = input.required<string>();

  private readonly store = inject(RaffleStore);
  private readonly confirmation = inject(ConfirmationService);

  public readonly raffle = computed(() => this.store.get(this.raffleId()));

  public declinePayment() {
    this.confirmation.open().mapRight(() => {
      numberFacade.declinePayment({ raffle: this.raffle(), value: +this.value() });
    });
  }

  public verifyPayment() {
    this.confirmation.open().mapRight(() => {
      numberFacade.verifyPayment({ raffle: this.raffle(), value: +this.value() });
    });
  }
}
