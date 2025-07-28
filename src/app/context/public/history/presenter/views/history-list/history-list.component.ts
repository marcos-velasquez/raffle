import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleComponent } from '@context/shared/presenter';
import { HistoryStore } from '@context/public/history/infrastructure';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-history-list',
  imports: [CommonModule, ActionsComponent, RaffleComponent],
  templateUrl: './history-list.component.html',
})
export class HistoryListComponent {
  public readonly historyStore = inject(HistoryStore);
}
