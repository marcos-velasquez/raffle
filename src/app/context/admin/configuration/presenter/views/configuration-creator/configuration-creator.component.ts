import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-creator',
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './configuration-creator.component.html',
})
export class ConfigurationCreatorComponent {
  public readonly form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required, Validators.minLength(1)]],
      phonePrefix: ['', [Validators.required, Validators.minLength(1)]],
      paymentDetails: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  public isModalOpen = false;

  public openModal() {
    this.isModalOpen = true;
    this.form.reset();
  }

  public closeModal() {
    this.isModalOpen = false;
  }

  public async onSubmit() {
    if (this.form.valid) {
      await configurationFacade.create(this.form.value);
      this.closeModal();
    }
  }
}
