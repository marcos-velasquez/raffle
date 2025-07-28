import { ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './only-number.directive';

describe('OnlyNumberDirective', () => {
  let directive: OnlyNumberDirective;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    directive = new OnlyNumberDirective(new ElementRef(inputElement));
  });

  it.each([
    { value: '123abc', expected: '123' },
    { value: '123 abc ***', expected: '123' },
    { value: '123 -1-2-3', expected: '123123' },
    { value: '123   ', expected: '123' },
    { value: '', expected: '' },
  ])('should remove non-numeric characters from the input value', ({ value, expected }) => {
    inputElement.value = value;
    directive.onInput();
    expect(inputElement.value).toBe(expected);
  });
});
