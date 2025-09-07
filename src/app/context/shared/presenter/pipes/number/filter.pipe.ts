import { Pipe, PipeTransform } from '@angular/core';
import { is } from '@shared/domain';
import { Number, NumberState } from '@context/shared/domain/number';

@Pipe({ name: 'withValue' })
export class NumberValueFilterPipe implements PipeTransform {
  transform(numbers: Number[], value: number | null): Number[] {
    return is
      .nil(value)
      .mapRight(() => numbers)
      .mapLeft(() => numbers.filter((number) => number.is.equal.value(value))).value;
  }
}

export type FilterState = 'all' | NumberState;

@Pipe({ name: 'withState' })
export class NumberStateFilterPipe implements PipeTransform {
  transform(numbers: Number[], state: FilterState): Number[] {
    return is
      .affirmative(state === 'all')
      .mapRight(() => numbers)
      .mapLeft(() => numbers.filter((number) => number.is.equal.state(state as NumberState))).value;
  }
}
