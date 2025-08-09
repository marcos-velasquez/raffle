import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle, RaffleEditPrimitives } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { RaffleEditedEvent, RaffleEditException } from '../../domain';

export type EditRaffleUseCaseProps = { raffle: Raffle; primitives: RaffleEditPrimitives };

export class EditRaffleUseCase extends AdminUseCase<EditRaffleUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Actualizando rifa...').withComplete('Rifa actualizada con éxito').build());
  }

  protected async next({ raffle, primitives }: EditRaffleUseCaseProps): Promise<E.Either<void, void>> {
    const isPriceDifferent = !raffle.is.equal.price(primitives.price);
    if (isPriceDifferent && raffle.has.purchased) return this.throw(new RaffleEditException());

    this.start();
    const result = await this.raffleRepository.update(Raffle.from({ ...raffle.toPrimitives(), ...primitives }));
    result.mapRight((raffle) => this.bus.publish(new RaffleEditedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
