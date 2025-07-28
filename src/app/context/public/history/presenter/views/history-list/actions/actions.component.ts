import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { History } from '@context/public/history/domain';

@Component({
  selector: 'app-actions',
  imports: [CommonModule, RouterLink],
  templateUrl: './actions.component.html',
})
export class ActionsComponent {
  public readonly history = input.required<History>();
}
