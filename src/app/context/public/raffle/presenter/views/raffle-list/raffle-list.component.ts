import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleComponent } from '@context/shared/presenter';
import { RaffleStore } from '@context/public/raffle/infrastructure/raffle.store';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-raffle-list',
  imports: [CommonModule, ActionsComponent, RaffleComponent],
  templateUrl: './raffle-list.component.html',
})
export class RaffleListComponent implements OnInit {
  public readonly raffleStore = inject(RaffleStore);

  ngOnInit(): void {
    this.raffleStore.switchAvailable();
  }
}
