import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { OnlyNumberDirective } from '@shared/presenter';
import { is, when } from '@shared/domain';
import { DropzoneComponent } from '@ui/components/dropzone';
import { RaffleDetailsComponent, NumberComponent } from '@context/shared/presenter';
import { Raffle, Voucher } from '@context/shared/domain';
import { numberFacade, BuyNumberOutput } from '../../../application';
import { PocketbaseVoucherRepository } from '../../../infrastructure';

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
  public readonly raffle = input.required<Raffle>();
  public readonly value = input.required({ transform: numberAttribute });

  private readonly router = inject(Router);

  public buyUseCase: BuyNumberOutput;
  public readonly form: FormGroup;

  constructor(private readonly voucherRepository: PocketbaseVoucherRepository) {
    effect(() => this.ensureAvailability());
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

  private ensureAvailability(): void {
    if (this.buyUseCase && this.raffle().get.number(this.value()).is.available) {
      this.router.navigate(['..']);
    }
  }

  public cancel(): void {
    when(this.buyUseCase.cancel()).map(() => this.router.navigate(['..']));
  }

  public async buy(): Promise<void> {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(async () => {
        const result = await this.voucherRepository.save(Voucher.create({ value: this.form.value.voucher[0] }));
        result.mapRight(async (voucher) => {
          const { name, phone } = this.form.value;
          const payerPrimitives = { name, phone, voucher: Voucher.from(voucher.toPrimitives()).toPrimitives() };
          const result = await this.buyUseCase.complete(payerPrimitives);
          result.mapRight(() => this.router.navigate(['..']));
        });
      });
  }

  public ngOnDestroy(): void {
    if (!this.buyUseCase.isCompleted()) {
      this.buyUseCase.cancel();
    }
  }
}
