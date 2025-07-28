import { cloneDeep, merge } from 'lodash';
import { is } from '../../either/either.builder';

export class _Object {
  constructor(private readonly object: Object) {}

  public get are() {
    return {
      all: {
        empty: Object.values(this.object).every((value) => value === null || value === undefined || value === ''),
      },
    };
  }

  public get action() {
    return {
      merge: (object: Object) => merge(this.object, object),
      clone: () => cloneDeep(this.object),
    };
  }
}

export const object = {
  clone: <T extends Object>(object: T) => new _Object(object).action.clone() as T,
  merge: <T extends Object>(origin: T, target: T) => new _Object(origin).action.merge(target),
  all: {
    empty: (object: Object) => is.affirmative(new _Object(object).are.all.empty),
  },
};
