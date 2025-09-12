import { PocketbaseRaffleRepository } from '@context/admin/raffle/infrastructure/raffle.repository';
import { SelectWinnerUseCase, SelectWinnerUseCaseProps } from './SelectWinner/select-winner.usecase';

export class RouletteFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public selectWinner(props: SelectWinnerUseCaseProps): void {
    new SelectWinnerUseCase(this.raffleRepository).execute(props);
  }
}

export const rouletteFacade = new RouletteFacade();
