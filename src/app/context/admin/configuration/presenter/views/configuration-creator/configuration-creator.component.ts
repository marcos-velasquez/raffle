import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-creator',
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, DialogComponent, DropzoneComponent],
  templateUrl: './configuration-creator.component.html',
})
export class ConfigurationCreatorComponent {
  public readonly uiDialog = viewChild.required(DialogComponent);
  public readonly form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required]],
      phonePrefix: ['', [Validators.required]],
      paymentDetails: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  public open() {
    when(this.form.reset()).map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public async create() {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(configurationFacade.create(this.form.getRawValue())).map(() => this.close());
      });
  }
}
