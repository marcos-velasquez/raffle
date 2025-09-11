import { Component, contentChild, ElementRef, input, output, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PickerTemplate = TemplateRef<{ pick: VoidFunction }>;

@Component({
  selector: 'ui-uploader',
  imports: [CommonModule],
  templateUrl: './uploader.component.html',
})
export class UploaderComponent {
  public readonly multiple = input<boolean>(false);
  public readonly accept = input<string>('image/*');
  public readonly disabled = input<boolean>(false);

  public readonly valueChange = output<File | File[]>();

  public readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  public readonly pickerTemplate = contentChild.required<PickerTemplate>('picker');

  public pick = (): void => {
    this.input().nativeElement.click();
  };

  public change(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList || fileList.length === 0) return;
    this.valueChange.emit(this.multiple() ? Array.from(fileList) : fileList[0]);
  }
}
