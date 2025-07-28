import { Raffle, RaffleCreatePrimitives } from '@context/shared/domain/raffle';
import { PocketbaseRaffleRepository } from '../infrastructure/raffle.repository';
import { CreateRaffleUseCase } from './Create/create.usecase';
import { RemoveRaffleUseCase } from './Remove/remove.usecase';
import { EditRaffleUseCase, EditRaffleUseCaseProps } from './Edit/edit.usecase';

export class RaffleFacade {
  private readonly raffleRepository = new PocketbaseRaffleRepository();

  public create(primitives: RaffleCreatePrimitives): void {
    new CreateRaffleUseCase(this.raffleRepository).execute(primitives);
  }

  public edit(input: EditRaffleUseCaseProps): void {
    new EditRaffleUseCase(this.raffleRepository).execute(input);
  }

  public remove(raffle: Raffle): void {
    new RemoveRaffleUseCase(this.raffleRepository).execute(raffle);
  }
}

export const raffleFacade = new RaffleFacade();
