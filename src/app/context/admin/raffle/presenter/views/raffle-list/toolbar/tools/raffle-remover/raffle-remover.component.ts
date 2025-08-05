import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '@ui/services/confirmation';
import { raffleFacade } from '@context/admin/raffle/application';
import { Raffle } from '@context/shared/domain/raffle';

@Component({
  selector: 'app-raffle-remover-tool',
  imports: [CommonModule],
  templateUrl: './raffle-remover.component.html',
})
export class RaffleRemoverComponent {
  public readonly raffle = input.required<Raffle>();

  private readonly confirmation = inject(ConfirmationService);

  public remove() {
    this.confirmation.open().mapRight(() => raffleFacade.remove(this.raffle()));
  }
}
