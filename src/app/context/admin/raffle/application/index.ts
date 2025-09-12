import { PocketbaseRaffleRepository } from '../infrastructure/raffle.repository';
import { CreateRaffleUseCase, CreateRaffleUseCaseProps } from './Create/create.usecase';
import { RemoveRaffleUseCase, RemoveRaffleUseCaseProps } from './Remove/remove.usecase';
import { UpdateRaffleUseCase, UpdateRaffleUseCaseProps } from './Update/update.usecase';

export class RaffleFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public create(props: CreateRaffleUseCaseProps): void {
    new CreateRaffleUseCase(this.raffleRepository).execute(props);
  }

  public update(props: UpdateRaffleUseCaseProps): void {
    new UpdateRaffleUseCase(this.raffleRepository).execute(props);
  }

  public remove(props: RemoveRaffleUseCaseProps): void {
    new RemoveRaffleUseCase(this.raffleRepository).execute(props);
  }
}

export const raffleFacade = new RaffleFacade();
