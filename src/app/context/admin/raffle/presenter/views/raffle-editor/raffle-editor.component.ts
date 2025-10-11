import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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

  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      prices: this.formBuilder.array([]),
      images: [[], [Validators.required, Validators.minLength(Raffle.MIN_IMAGES)]],
    });
  }

  ngOnInit(): void {
    this.prices.clear();
    this.raffle().prices.forEach((price) =>
      this.prices.push(this.formBuilder.control(price.value, [Validators.required, Validators.min(Raffle.MIN_PRICE)]))
    );

    is.affirmative(this.raffle().has.purchased).mapRight(() => this.prices.disable());
  }

  public get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  public open(): void {
    const { prices, ...rest } = this.raffle().toPrimitives();
    when(this.form.patchValue({ ...rest }))
      .map(() => this.ngOnInit())
      .map(() => this.uiDialog().open());
  }

  public close(): void {
    this.uiDialog().close();
  }

  public update(): void {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        const formValue = this.form.getRawValue();
        const prices = this.raffle().prices.map(({ currency }, i) => ({ value: formValue.prices[i], currency }));
        when(raffleFacade.update({ raffle: this.raffle(), primitives: { ...formValue, prices } })).map(() =>
          this.close()
        );
      });
  }
}
