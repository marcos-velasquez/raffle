import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RaffleDetailsComponent, NumberComponent, FiltersComponent } from '@context/shared/presenter';
import { RaffleStore } from '@context/admin/raffle/infrastructure';

@Component({
  selector: 'app-number-list',
  imports: [CommonModule, RouterLink, RaffleDetailsComponent, FiltersComponent, NumberComponent],
  templateUrl: './number-list.component.html',
})
export class NumberListComponent {
  public readonly raffleId = input.required<string>();

  private readonly store = inject(RaffleStore);

  public readonly raffle = computed(() => this.store.get(this.raffleId()));
}
