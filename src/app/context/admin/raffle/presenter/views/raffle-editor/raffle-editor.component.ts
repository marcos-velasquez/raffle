import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { Raffle } from '@context/shared/domain/raffle';
import { BaseComponent, RaffleFullPathsPipe } from '@context/shared/presenter';
import { raffleFacade } from '@context/admin/raffle/application';

@Component({
  selector: 'app-raffle-editor',
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe, DialogComponent, DropzoneComponent, RaffleFullPathsPipe],
  templateUrl: './raffle-editor.component.html',
})
export class RaffleEditorComponent extends BaseComponent implements OnInit {
  public readonly raffle = input.required<Raffle>();
  public readonly uiDialog = viewChild.required(DialogComponent);
  public readonly form: FormGroup;

  constructor() {
    super();
    this.form = inject(FormBuilder).group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(Raffle.MIN_PRICE)]],
      images: [[], [Validators.required, Validators.minLength(Raffle.MIN_IMAGES)]],
    });
  }

  ngOnInit(): void {
    is.affirmative(this.raffle().has.purchased).mapRight(() => this.form.get('price')!.disable());
  }

  public open(): void {
    when(this.form.patchValue({ ...this.raffle().toPrimitives() })).map(() => {
      this.uiDialog().open();
    });
  }

  public close(): void {
    this.uiDialog().close();
  }

  public update(): void {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(raffleFacade.update({ raffle: this.raffle(), primitives: this.form.getRawValue() })).map(() =>
          this.close()
        );
      });
  }
}
