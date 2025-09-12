import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle, RaffleUpdatePrimitives } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application';
import { RaffleUpdatedEvent, RaffleUpdateException } from '../../domain';

export type UpdateRaffleUseCaseProps = { raffle: Raffle; primitives: RaffleUpdatePrimitives };

export class UpdateRaffleUseCase extends AdminUseCase<UpdateRaffleUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('progress.updatingRaffle').withComplete('progress.raffleUpdatedSuccess').build());
  }

  protected async next({ raffle, primitives }: UpdateRaffleUseCaseProps): Promise<E.Either<void, void>> {
    const isPriceDifferent = !raffle.is.equal.price(primitives.price);
    if (isPriceDifferent && raffle.has.purchased) return this.throw(new RaffleUpdateException());

    this.start();
    const result = await this.raffleRepository.update(Raffle.from({ ...raffle.toPrimitives(), ...primitives }));
    result.mapRight((raffle) => this.bus.publish(new RaffleUpdatedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
