import { Component, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'ui-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  public readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public get close$() {
    return fromEvent(this.dialog().nativeElement, 'close');
  }

  public get is() {
    return {
      opened: this.dialog().nativeElement.open,
      closed: !this.dialog().nativeElement.open,
    };
  }

  public open(): void {
    this.dialog().nativeElement.showModal();
  }

  public close(): void {
    this.dialog().nativeElement.close();
  }
}
