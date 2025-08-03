import { assert } from '../assert/assert';

export const random = {
  int: (min: number, max: number): number => {
    assert(min < max, 'The min value must be less than the max.');
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  from<T>(array: T[]): T {
    assert(array.length > 0, 'The array must not be empty.');
    return array[this.int(0, array.length - 1)];
  },
};
