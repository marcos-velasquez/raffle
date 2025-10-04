import { Component, computed, effect, inject, input, numberAttribute, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { is } from '@shared/domain';
import { DropzoneComponent } from '@ui/components/dropzone';
import { RaffleDetailsComponent, NumberComponent, BaseComponent } from '@context/shared/presenter';
import { Voucher } from '@context/shared/domain';
import { PocketbaseVoucherRepository } from '@context/shared/infrastructure';
import { RaffleStore } from '@context/public/raffle/infrastructure';
import { numberFacade, BuyNumberOutput } from '../../../application';
import { PaymentDetailsComponent } from './components';

@Component({
  selector: 'app-number-buyer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoPipe,
    NgxMaskDirective,
    DropzoneComponent,
    RaffleDetailsComponent,
    NumberComponent,
    PaymentDetailsComponent,
  ],
  providers: [provideNgxMask()],
  templateUrl: './number-buyer.component.html',
})
export class NumberBuyerComponent extends BaseComponent {
  public readonly raffleId = input.required<string>();
  public readonly value = input.required({ transform: numberAttribute });

  private readonly store = inject(RaffleStore);
  private readonly router = inject(Router);

  public readonly raffle = computed(() => this.store.get(this.raffleId()));

  public buyUseCase: BuyNumberOutput;
  public readonly form: FormGroup;

  constructor(private readonly voucherRepository: PocketbaseVoucherRepository) {
    super();
    effect(() => this.ensureAvailability());
    this.form = inject(FormBuilder).group({
      name: ['', [Validators.required]],
      phone: ['58', [Validators.required]],
      voucher: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buyUseCase = numberFacade.buy({ raffle: this.raffle(), value: this.value() });
    this.buyUseCase.start();
  }

  private ensureAvailability(): void {
    if (this.buyUseCase && this.raffle().get.number(this.value()).is.available) {
      this.cancel();
    }
  }

  public cancel(): void {
    this.router.navigate(['raffle', this.raffleId()]);
  }

  public async buy(): Promise<void> {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(async () => {
        const result = await this.voucherRepository.save(Voucher.create({ value: this.form.value.voucher[0] }));
        result.mapRight(async (voucher) => {
          const { name, phone } = this.form.value;
          const payerPrimitives = { name, phone, voucher: voucher.toPrimitives() };
          const result = await this.buyUseCase.complete(payerPrimitives);
          result.mapRight(() => this.router.navigate(['..']));
        });
      });
  }

  @HostListener('window:beforeunload')
  @HostListener('window:unload')
  @HostListener('window:blur')
  public onPageExit(): void {
    this.cancel();
  }

  public ngOnDestroy(): void {
    if (!this.buyUseCase.isCompleted()) {
      this.buyUseCase.cancel();
    }
  }
}
