import { is } from '../../either/either.builder';
import { assert } from '../assert/assert';
import { $is } from '../is/is';
import { not } from '../operators/operators';
import { deepMerge } from './deep-merge';

export const $object = {
  are: (object: object) => {
    return {
      all: {
        empty: Object.values(object).every((value) => $is.empty(value)),
      },
    };
  },

  action: (object: object) => {
    assert(not($is.nil(object)), 'object is null or undefined');

    return {
      merge: (target: object) => deepMerge(object, target),
      clone: () => JSON.parse(JSON.stringify(object)),
    };
  },
};

export const object = {
  clone: <T extends object>(object: T) => $object.action(object).clone() as T,
  merge: <T extends object>(origin: T, target: object) => $object.action(origin).merge(target),
  all: {
    empty: (object: object) => is.affirmative($object.are(object).all.empty),
  },
};
