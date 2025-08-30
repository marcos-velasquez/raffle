import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { Raffle } from '@context/shared/domain';
import { raffleFacade } from '@context/admin/raffle/application';

@Component({
  selector: 'app-raffle-creator',
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe, DialogComponent, DropzoneComponent],
  templateUrl: './raffle-creator.component.html',
})
export class RaffleCreatorComponent {
  public readonly uiDialog = viewChild.required(DialogComponent);
  public readonly form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(Raffle.MIN_PRICE)]],
      images: [[], [Validators.required, Validators.minLength(Raffle.MIN_IMAGES)]],
      quantityNumbers: [0, [Validators.required, Validators.min(Raffle.MIN_NUMBERS)]],
    });
  }

  public open() {
    when(this.form.reset()).map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public create(): void {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(raffleFacade.create(this.form.getRawValue())).map(() => this.close());
      });
  }
}
