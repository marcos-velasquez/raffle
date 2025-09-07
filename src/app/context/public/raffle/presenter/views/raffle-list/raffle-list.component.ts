import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleComponent } from '@context/shared/presenter';
import { RaffleStore } from '../../../infrastructure';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-raffle-list',
  imports: [CommonModule, ActionsComponent, RaffleComponent],
  templateUrl: './raffle-list.component.html',
})
export class RaffleListComponent {
  public readonly raffleStore = inject(RaffleStore);
}
