import { object } from '../../object/object';

describe('object utility', () => {
  describe('clone', () => {
    it('should create a deep clone of an object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = object.clone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('should throw an error when the object is null or undefined', () => {
      expect(() => object.clone(null as any)).toThrow();
      expect(() => object.clone(undefined as any)).toThrow();
    });
  });

  describe('merge', () => {
    it('should deeply merge two objects', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 4 }, e: 5 };
      const merged = object.merge(target, source);

      expect(merged).toEqual({
        a: 1,
        b: { c: 4, d: 3 },
        e: 5,
      });

      expect(target).toEqual({ a: 1, b: { c: 2, d: 3 } });
      expect(source).toEqual({ b: { c: 4 }, e: 5 });
    });

    it('should handle empty objects', () => {
      expect(object.merge({}, {})).toEqual({});
      expect(object.merge({ a: 1 }, {})).toEqual({ a: 1 });
      expect(object.merge({}, { a: 1 })).toEqual({ a: 1 });
    });
  });

  describe('all.empty', () => {
    it('should check if all object values are empty', () => {
      expect(object.all.empty({}).isRight()).toBe(true);
      expect(object.all.empty({ a: null, b: undefined, c: '' }).isRight()).toBe(true);
      expect(object.all.empty({ a: ' ', b: '\t\n' }).isRight()).toBe(false);
      expect(object.all.empty({ a: 0, b: false }).isRight()).toBe(false);
      expect(object.all.empty({ a: 'value' }).isRight()).toBe(false);
    });
  });
});
