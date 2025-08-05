import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { confirmation } from '@ui/services/confirmation';
import { ExpandImageDirective } from '@ui/directives/expand-image';
import { RaffleDetailsComponent, NumberComponent } from '@context/shared/presenter';
import { Raffle } from '@context/shared/domain';
import { numberFacade } from '../../../application';

@Component({
  selector: 'app-number-editor',
  imports: [CommonModule, TranslocoPipe, RaffleDetailsComponent, NumberComponent, ExpandImageDirective],
  templateUrl: './number-editor.component.html',
})
export class NumberEditorComponent {
  public readonly value = input.required<string>();
  public readonly raffle = input.required<Raffle>();

  public declinePayment() {
    confirmation.open().mapRight(() => {
      numberFacade.declinePayment({ raffle: this.raffle(), value: +this.value() });
    });
  }

  public verifyPayment() {
    confirmation.open().mapRight(() => {
      numberFacade.verifyPayment({ raffle: this.raffle(), value: +this.value() });
    });
  }
}
