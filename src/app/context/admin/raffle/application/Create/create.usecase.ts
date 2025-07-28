import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle, RaffleCreatePrimitives } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { RaffleCreatedEvent } from '../../domain/raffle.event';

export class CreateRaffleUseCase extends AdminUseCase<RaffleCreatePrimitives, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Creando rifa...').withComplete('Rifa creada con éxito').build());
  }

  protected async next(primitives: RaffleCreatePrimitives): Promise<E.Either<void, void>> {
    this.start();
    const raffle = Raffle.create(primitives);
    const result = await this.raffleRepository.save(raffle);
    result.mapRight((raffle) => this.bus.publish(new RaffleCreatedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
