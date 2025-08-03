import { $is } from '../../is/is';

describe('$is utility', () => {
  test('undefined', () => {
    expect($is.undefined(undefined)).toBe(true);
    expect($is.undefined(null)).toBe(false);
    expect($is.undefined(0)).toBe(false);
  });

  test('affirmative', () => {
    expect($is.affirmative(true)).toBe(true);
    expect($is.affirmative(1)).toBe(true);
    expect($is.affirmative('hello')).toBe(true);
    expect($is.affirmative(false)).toBe(false);
    expect($is.affirmative(0)).toBe(false);
    expect($is.affirmative('')).toBe(false);
  });

  test('error', () => {
    expect($is.error(new Error('fail'))).toBe(true);
    expect($is.error({})).toBe(false);
    expect($is.error('error')).toBe(false);
  });

  test('empty', () => {
    expect($is.empty([])).toBe(true);
    expect($is.empty('')).toBe(true);
    expect($is.empty(null)).toBe(true);
    expect($is.empty(undefined)).toBe(true);
    expect($is.empty([1])).toBe(false);
    expect($is.empty('text')).toBe(false);
    expect($is.empty(0)).toBe(false);
  });

  test('nil', () => {
    expect($is.nil(null)).toBe(true);
    expect($is.nil(undefined)).toBe(true);
    expect($is.nil('')).toBe(false);
    expect($is.nil(0)).toBe(false);
  });

  test('string', () => {
    expect($is.string('hello')).toBe(true);
    expect($is.string(123)).toBe(false);
    expect($is.string({})).toBe(false);
  });

  test('number', () => {
    expect($is.number(123)).toBe(true);
    expect($is.number('123')).toBe(false);
    expect($is.number(NaN)).toBe(true);
  });

  test('boolean', () => {
    expect($is.boolean(true)).toBe(true);
    expect($is.boolean(false)).toBe(true);
    expect($is.boolean(0)).toBe(false);
  });

  test('array', () => {
    expect($is.array([])).toBe(true);
    expect($is.array([1, 2, 3])).toBe(true);
    expect($is.array('not array')).toBe(false);
    expect($is.array({})).toBe(false);
  });
});
