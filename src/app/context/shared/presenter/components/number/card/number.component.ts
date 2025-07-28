import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Number } from '../../../../domain';
import { NumberColorStatePipe, NumberTextStatePipe } from '../../../pipes';

@Component({
  selector: 'app-number',
  imports: [CommonModule, NumberTextStatePipe, NumberColorStatePipe],
  templateUrl: './number.component.html',
})
export class NumberComponent {
  public readonly number = input.required<Number>();
}
