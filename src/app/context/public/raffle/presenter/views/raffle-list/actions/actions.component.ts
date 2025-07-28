import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Raffle } from '@context/shared/domain/raffle';

@Component({
  selector: 'app-actions',
  imports: [CommonModule, RouterLink],
  templateUrl: './actions.component.html',
})
export class ActionsComponent {
  public readonly raffle = input.required<Raffle>();
}
