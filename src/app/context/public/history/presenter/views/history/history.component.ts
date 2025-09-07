import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { FullPathPipe } from '@shared/presenter';
import { NumberDetailsComponent, RaffleDetailsComponent } from '@context/shared/presenter';
import { History } from '../../../domain';

@Component({
  selector: 'app-history',
  imports: [CommonModule, TranslocoPipe, FullPathPipe, RaffleDetailsComponent, NumberDetailsComponent],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  public readonly history = input.required<History>();
}
