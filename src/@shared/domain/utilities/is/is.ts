export const $is = {
  undefined: (value: unknown): boolean => value === undefined,
  affirmative: (value: unknown): boolean => Boolean(value),
  error: (value: unknown): boolean => value instanceof Error,
  empty: (value: unknown): boolean =>
    (Array.isArray(value) && value.length === 0) || value === null || value === undefined || value === '',
  nil: (value: unknown): boolean => value === null || value === undefined,
  string: (value: unknown): boolean => typeof value === 'string',
  number: (value: unknown): boolean => typeof value === 'number',
  boolean: (value: unknown): boolean => typeof value === 'boolean',
  array: (value: unknown): boolean => Array.isArray(value),
};
