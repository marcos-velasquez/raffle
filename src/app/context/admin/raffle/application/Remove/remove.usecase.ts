import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application';
import { RaffleRemovedEvent, RaffleRemoveException } from '../../domain';

export type RemoveRaffleUseCaseProps = Raffle;

export class RemoveRaffleUseCase extends AdminUseCase<RemoveRaffleUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('progress.removingRaffle').withComplete('progress.raffleRemovedSuccess').build());
  }

  protected async next(raffle: RemoveRaffleUseCaseProps): Promise<E.Either<void, void>> {
    if (raffle.has.purchased) return this.throw(new RaffleRemoveException());

    this.start();
    const result = await this.raffleRepository.remove(raffle);
    result.mapRight(() => this.bus.publish(new RaffleRemovedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
