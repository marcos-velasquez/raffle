import { is } from '../../either/either.builder';

export const $object = {
  are: (object: object) => {
    return {
      all: {
        empty: Object.values(object).every((value) => value === null || value === undefined || value === ''),
      },
    };
  },

  action: (object: object) => {
    return {
      merge: (target: object) => Object.assign(object, target),
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
