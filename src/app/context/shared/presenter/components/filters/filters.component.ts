import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Number } from '../../../domain';
import { NumberStateFilterPipe, NumberValueFilterPipe, FilterState } from '../../pipes';

@Component({
  selector: 'app-filters',
  imports: [CommonModule, ReactiveFormsModule, NumberValueFilterPipe, NumberStateFilterPipe],
  templateUrl: './filters.component.html',
})
export class FiltersComponent {
  @ContentChild(TemplateRef) numberListTemplate!: TemplateRef<any>;
  public readonly numbers = input.required<Number[]>();

  public readonly value = new FormControl<number | null>(null);
  public readonly state = new FormControl<FilterState>('all');
}
