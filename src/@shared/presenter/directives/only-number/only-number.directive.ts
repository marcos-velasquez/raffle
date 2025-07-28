import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumber]',
})
export class OnlyNumberDirective {
  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const inputValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const value = inputValue.replace(/[^\d]/g, '');
    if (value !== inputValue) {
      input.value = value;
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}
