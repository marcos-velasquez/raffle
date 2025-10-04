import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { Price } from '@context/shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { channelFacade } from '../../../application';

@Component({
  selector: 'app-channel-creator',
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, DialogComponent, DropzoneComponent],
  templateUrl: './channel-creator.component.html',
})
export class ChannelCreatorComponent {
  public readonly uiDialog = viewChild.required(DialogComponent);

  public readonly currencies = Price.currencies;
  public readonly form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required]],
      details: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  public open() {
    when(this.form.reset())
      .map(() => this.form.get('currency').setValue(Price.currencies[0]))
      .map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public async create() {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(channelFacade.create(this.form.getRawValue())).map(() => this.close());
      });
  }
}
