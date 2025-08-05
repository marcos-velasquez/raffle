import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { RaffleDetailsComponent, NumberComponent, FiltersComponent } from '@context/shared/presenter';
import { Raffle } from '@context/shared/domain';

@Component({
  selector: 'app-number-list',
  imports: [CommonModule, RouterLink, TranslocoPipe, RaffleDetailsComponent, FiltersComponent, NumberComponent],
  templateUrl: './number-list.component.html',
})
export class NumberListComponent {
  public readonly raffle = input.required<Raffle>();
}
