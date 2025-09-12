import { PocketbaseRaffleRepository } from '@context/public/raffle/infrastructure/raffle.repository';
import { BuyNumberUseCase, BuyNumberUseCaseProps } from './Buy/buy.usecase';

export * from './Buy/buy.usecase';

export class NumberFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public buy(props: BuyNumberUseCaseProps) {
    return new BuyNumberUseCase(this.raffleRepository).execute(props);
  }
}

export const numberFacade = new NumberFacade();
