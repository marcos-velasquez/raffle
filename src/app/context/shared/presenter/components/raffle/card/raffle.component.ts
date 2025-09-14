import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandImageDirective } from '@ui/directives/expand-image';
import { Raffle } from '../../../../domain';
import { RaffleFullPathPipe } from '../../../pipes';
import { BaseComponent } from '../../base';

@Component({
  selector: 'app-raffle',
  imports: [CommonModule, ExpandImageDirective, RaffleFullPathPipe],
  templateUrl: './raffle.component.html',
})
export class RaffleComponent extends BaseComponent {
  public readonly raffle = input.required<Raffle>();
}
