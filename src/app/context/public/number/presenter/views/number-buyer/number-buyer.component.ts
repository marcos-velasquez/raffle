import { Component, inject, input, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { OnlyNumberDirective } from '@shared/presenter';
import { is, when } from '@shared/domain';
import { DropzoneComponent } from '@ui/components/dropzone';
import { RaffleDetailsComponent, NumberComponent } from '@context/shared/presenter';
import { Raffle } from '@context/shared/domain';
import { numberFacade } from '../../../application';

@Component({
  selector: 'app-number-buyer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoPipe,
    DropzoneComponent,
    OnlyNumberDirective,
    RaffleDetailsComponent,
    NumberComponent,
  ],
  templateUrl: './number-buyer.component.html',
})
export class NumberBuyerComponent {
  public readonly value = input.required({ transform: numberAttribute });
  public readonly raffle = input.required<Raffle>();

  public buyUseCase: any;
  public readonly form: FormGroup;

  constructor(private readonly router: Router) {
    this.form = inject(FormBuilder).group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      voucher: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buyUseCase = numberFacade.buy({ raffle: this.raffle(), value: this.value() });
    this.buyUseCase.start();
  }

  public cancel(): void {
    when(this.buyUseCase.cancel()).map(() => this.router.navigate(['..']));
  }

  public create(): void {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(this.buyUseCase.complete(this.form.getRawValue())).map(() => this.router.navigate(['..']));
      });
  }
}
