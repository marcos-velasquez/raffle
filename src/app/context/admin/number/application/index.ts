import { PocketbaseRaffleRepository } from '@context/admin/raffle/infrastructure/raffle.repository';
import { DeclinePaymentUseCase, DeclinePaymentUseCaseProps } from './DeclinePayment/decline-payment.usecase';
import { VerifyPaymentUseCase, VerifyPaymentUseCaseProps } from './VerifyPayment/verify-payment.usecase';

export class NumberFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public declinePayment(props: DeclinePaymentUseCaseProps) {
    new DeclinePaymentUseCase(this.raffleRepository).execute(props);
  }

  public verifyPayment(props: VerifyPaymentUseCaseProps) {
    new VerifyPaymentUseCase(this.raffleRepository).execute(props);
  }
}

export const numberFacade = new NumberFacade();
