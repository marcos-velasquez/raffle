import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleComponent } from '@context/shared/presenter';
import { RaffleStore } from '../../../infrastructure';
import { RaffleCreatorComponent } from '../raffle-creator/raffle-creator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-raffle-list',
  imports: [CommonModule, ToolbarComponent, ActionsComponent, RaffleCreatorComponent, RaffleComponent],
  templateUrl: './raffle-list.component.html',
})
export class RaffleListComponent {
  public readonly raffleStore = inject(RaffleStore);
}
