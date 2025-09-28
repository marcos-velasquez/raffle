import { Component, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { ConfigurationFullPathPipe } from '@context/shared/presenter';
import { Configuration } from '@context/shared/domain';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    DialogComponent,
    DropzoneComponent,
    ConfigurationFullPathPipe,
  ],
  templateUrl: './configuration-editor.component.html',
})
export class ConfigurationEditorComponent {
  public readonly configuration = input.required<Configuration>();

  public readonly uiDialog = viewChild.required(DialogComponent);

  public form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required]],
      phonePrefix: ['', [Validators.required]],
      paymentDetails: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  public open() {
    when(this.form.patchValue(this.configuration().toPrimitives())).map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public async update() {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(configurationFacade.update({ configuration: this.configuration(), primitives: this.form.value })).map(() =>
          this.close()
        );
      });
  }
}
