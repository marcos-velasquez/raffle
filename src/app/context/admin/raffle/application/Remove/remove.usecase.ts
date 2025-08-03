import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { assert, BaseRepository, EitherBuilder, not } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { RaffleRemovedEvent } from '../../domain/raffle.event';

export type RemoveRaffleUseCaseProps = Raffle;

export class RemoveRaffleUseCase extends AdminUseCase<RemoveRaffleUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Eliminando rifa...').withComplete('Rifa eliminada con éxito').build());
  }

  protected async next(props: RemoveRaffleUseCaseProps): Promise<E.Either<void, void>> {
    assert(not(props.has.purchased), 'Not allowed to remove a raffle with purchases');

    this.start();
    const result = await this.raffleRepository.remove(props);
    result.mapRight(() => this.bus.publish(new RaffleRemovedEvent(props)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
