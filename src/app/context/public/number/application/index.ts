import { PocketbaseRaffleRepository } from '@context/public/raffle/infrastructure/raffle.repository';
import { BuyNumberUseCase, BuyNumberUseCaseProps } from './Buy/buy.usecase';

export * from './Buy/buy.usecase';

export class NumberFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public buy(input: BuyNumberUseCaseProps) {
    return new BuyNumberUseCase(this.raffleRepository).execute(input);
  }
}

export const numberFacade = new NumberFacade();
