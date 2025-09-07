import { Directive, ElementRef, HostListener } from '@angular/core';
import Viewer from 'viewerjs';

@Directive({ selector: '[expandImage]' })
export class ExpandImageDirective {
  private viewer!: Viewer;

  constructor(private readonly el: ElementRef) {}

  ngAfterViewInit() {
    this.viewer = new Viewer(this.el.nativeElement, { transition: false });
  }

  @HostListener('click') onClick() {
    this.viewer.show();
  }
}
