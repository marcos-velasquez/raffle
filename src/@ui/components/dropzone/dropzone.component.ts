import { Component, effect, ElementRef, input, output, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { signalList } from '@shared/domain/signal';
import { $url, when } from '@shared/domain';
import Dropzone from 'dropzone';

@Component({
  selector: 'ui-dropzone',
  imports: [CommonModule],
  templateUrl: './dropzone.component.html',
})
export class DropzoneComponent {
  public readonly dropzoneElement = viewChild.required<ElementRef<HTMLFormElement>>('dropzone');
  public readonly change = output<File[]>();
  public readonly maxFiles = input(10);
  public readonly maxFilesize = input(10);
  public readonly acceptedFiles = input('image/*');
  public readonly defaultUrls = input<string[]>([]);

  public readonly files = signalList(signal<File[]>([]));
  private readonly transloco = inject(TranslocoService);

  constructor() {
    effect(() => this.change.emit(this.files.values));
  }

  ngAfterViewInit() {
    const dropzone = new Dropzone(this.dropzoneElement().nativeElement, {
      url: '/',
      addRemoveLinks: true,
      dictRemoveFile: this.transloco.translate('dropzone.removeFile'),
      dictDefaultMessage: this.transloco.translate('dropzone.defaultMessage'),
      dictFileTooBig: this.transloco.translate('dropzone.fileTooBig'),
      dictMaxFilesExceeded: this.transloco.translate('dropzone.maxFilesExceeded'),
      maxFilesize: this.maxFilesize(),
      maxFiles: this.maxFiles(),
      acceptedFiles: this.acceptedFiles(),
      autoQueue: false,
      autoProcessQueue: false,
      init: async () => {
        for (const url of this.defaultUrls()) {
          const file = await $url.to.file(url);
          when(dropzone.emit('addedfile', file)).map(() => dropzone.emit('thumbnail', file, url));
        }
      },
    });

    dropzone.on('addedfile', (file) => this.files.insert(file));
    dropzone.on('removedfile', (file) => this.files.remove(file));
  }
}
