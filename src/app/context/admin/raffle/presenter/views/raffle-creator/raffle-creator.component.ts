import { Component, inject, viewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { BaseComponent } from '@context/shared/presenter';
import { Raffle } from '@context/shared/domain';
import { raffleFacade } from '@context/admin/raffle/application';

@Component({
  selector: 'app-raffle-creator',
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe, DialogComponent, DropzoneComponent],
  templateUrl: './raffle-creator.component.html',
})
export class RaffleCreatorComponent extends BaseComponent implements OnInit {
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
      quantityNumbers: [0, [Validators.required, Validators.min(Raffle.MIN_NUMBERS)]],
    });
  }

  ngOnInit(): void {
    this.prices.clear();
    this.uniqueChannels.forEach(() =>
      this.prices.push(this.formBuilder.control(0, [Validators.required, Validators.min(Raffle.MIN_PRICE)]))
    );
  }

  public get uniqueChannels() {
    return this.channelStore.uniques();
  }

  public get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  public open() {
    when(this.form.reset())
      .map(() => this.ngOnInit())
      .map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public create(): void {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        const formValue = this.form.getRawValue();
        const prices = this.uniqueChannels.map(({ currency }, i) => ({ value: formValue.prices[i], currency }));
        when(raffleFacade.create({ ...formValue, prices })).map(() => this.close());
      });
  }
}
