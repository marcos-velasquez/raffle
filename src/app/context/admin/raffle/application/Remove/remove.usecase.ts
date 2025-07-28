import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { assert, BaseRepository, EitherBuilder, not } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { RaffleRemovedEvent } from '../../domain/raffle.event';

export class RemoveRaffleUseCase extends AdminUseCase<Raffle, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Eliminando rifa...').withComplete('Rifa eliminada con éxito').build());
  }

  protected async next(raffle: Raffle): Promise<E.Either<void, void>> {
    assert(not(raffle.has.purchased), 'Not allowed to remove a raffle with purchases');

    this.start();
    const result = await this.raffleRepository.remove(raffle);
    result.mapRight(() => this.bus.publish(new RaffleRemovedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
