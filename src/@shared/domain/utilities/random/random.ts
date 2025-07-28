import { random } from 'lodash';
import { assert } from '../assert/assert';

export class Random {
  public static int(min: number, max: number): number {
    assert(min < max, 'The min value must be less than the max.');
    return random(min, max);
  }

  public static from<T>(array: T[]): number {
    assert(array.length > 0, 'The array must not be empty.');
    return Random.int(0, array.length - 1);
  }
}
