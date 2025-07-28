import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { assert, BaseRepository, EitherBuilder, not, or } from '@shared/domain';
import { Raffle, RaffleEditPrimitives } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { RaffleEditedEvent } from '../../domain/raffle.event';

export type EditRaffleUseCaseProps = { raffle: Raffle; primitives: RaffleEditPrimitives };

export class EditRaffleUseCase extends AdminUseCase<EditRaffleUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Actualizando rifa...').withComplete('Rifa actualizada con éxito').build());
  }

  protected async next({ raffle, primitives }: EditRaffleUseCaseProps): Promise<E.Either<void, void>> {
    const isPriceEqual = raffle.is.equal.price(primitives.price);
    assert(or(isPriceEqual, not(raffle.has.purchased)), 'Not allowed to edit price of purchased raffle');

    this.start();
    const result = await this.raffleRepository.update(Raffle.from({ ...raffle.toPrimitives(), ...primitives }));
    result.mapRight((raffle) => this.bus.publish(new RaffleEditedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
