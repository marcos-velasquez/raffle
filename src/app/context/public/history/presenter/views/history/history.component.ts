import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullPathPipe } from '@shared/presenter';
import { NumberDetailsComponent, RaffleDetailsComponent } from '@context/shared/presenter';
import { History } from '@context/public/history/domain';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FullPathPipe, RaffleDetailsComponent, NumberDetailsComponent],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  public readonly history = input.required<History>();
}
