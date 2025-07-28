import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Number } from '../../../../domain';

@Component({
  selector: 'app-number-details',
  imports: [CommonModule],
  templateUrl: './number.component.html',
})
export class NumberDetailsComponent {
  public readonly number = input.required<Number>();
}
