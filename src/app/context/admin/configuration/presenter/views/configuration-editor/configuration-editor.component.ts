import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Configuration } from '../../../domain';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-editor',
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './configuration-editor.component.html',
})
export class ConfigurationEditorComponent {
  public readonly configuration = input.required<Configuration>();

  public isModalOpen = false;

  public form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required, Validators.minLength(1)]],
      phonePrefix: ['', [Validators.required, Validators.minLength(1)]],
      paymentDetails: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  public openModal() {
    this.isModalOpen = true;
    this.form.patchValue({
      currency: this.configuration().currency,
      phonePrefix: this.configuration().phonePrefix,
      paymentDetails: this.configuration().paymentDetails,
    });
  }

  public closeModal() {
    this.isModalOpen = false;
  }

  public async onSubmit() {
    if (this.form.valid) {
      await configurationFacade.update({ configuration: this.configuration(), primitives: this.form.value });
      this.closeModal();
    }
  }
}
