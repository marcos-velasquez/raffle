import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { switchMap } from 'rxjs';
import Dropzone from 'dropzone';
import { $url, when, signalList } from '@shared/domain';
import { BaseComponent } from '@shared/presenter';

@Component({
  selector: 'ui-dropzone',
  imports: [CommonModule],
  templateUrl: './dropzone.component.html',
})
export class DropzoneComponent extends BaseComponent {
  public readonly maxFiles = input(10);
  public readonly maxFilesize = input(10);
  public readonly acceptedFiles = input('image/*');
  public readonly defaultUrls = input<string[]>([]);

  public readonly dropzoneElement = viewChild.required<ElementRef<HTMLFormElement>>('dropzone');
  public readonly change = output<File[]>();

  public readonly dropzone = signal<Dropzone | null>(null);
  public readonly files = signalList(signal<File[]>([]));

  constructor(private readonly transloco: TranslocoService) {
    super();
    effect(() => this.change.emit(this.files.values));
  }

  ngAfterViewInit() {
    this.transloco.langChanges$
      .pipe(
        switchMap(() => this.transloco.load(this.transloco.getActiveLang())),
        this.unsubscribe()
      )
      .subscribe(() => this.initializeDropzone());
  }

  private initializeDropzone() {
    this.dropzone()?.destroy();
    this.dropzoneElement().nativeElement.innerHTML = '';

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
          when(this.dropzone()?.emit('addedfile', file)).map(() => this.dropzone()?.emit('thumbnail', file, url));
        }
      },
    });

    this.dropzone.set(dropzone);
    this.dropzone().on('addedfile', (file) => this.files.insert(file));
    this.dropzone().on('removedfile', (file) => this.files.remove(file));
  }
}
