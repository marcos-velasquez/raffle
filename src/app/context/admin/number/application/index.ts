import { PocketbaseRaffleRepository } from '@context/admin/raffle/infrastructure/raffle.repository';
import { DeclinePaymentUseCase, DeclinePaymentUseCaseProps } from './DeclinePayment/decline-payment.usecase';
import { VerifyPaymentUseCase, VerifyPaymentUseCaseProps } from './VerifyPayment/verify-payment.usecase';

export class NumberFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public declinePayment(input: DeclinePaymentUseCaseProps): void {
    new DeclinePaymentUseCase(this.raffleRepository).execute(input);
  }

  public verifyPayment(input: VerifyPaymentUseCaseProps): void {
    new VerifyPaymentUseCase(this.raffleRepository).execute(input);
  }
}

export const numberFacade = new NumberFacade();
