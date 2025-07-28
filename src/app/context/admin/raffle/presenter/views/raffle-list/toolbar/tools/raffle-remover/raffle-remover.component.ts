import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { confirmation } from '@ui/services/confirmation';
import { raffleFacade } from '@context/admin/raffle/application';
import { Raffle } from '@context/shared/domain/raffle';

@Component({
  selector: 'app-raffle-remover-tool',
  imports: [CommonModule],
  templateUrl: './raffle-remover.component.html',
})
export class RaffleRemoverComponent {
  public readonly raffle = input.required<Raffle>();

  public remove() {
    confirmation.open().mapRight(() => raffleFacade.remove(this.raffle()));
  }
}
