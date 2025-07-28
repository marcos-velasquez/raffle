import * as E from '@sweet-monads/either';
import { assert, BaseRepository, EitherBuilder, transaction } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application/admin.usecase';
import { WinnerSelectedEvent } from '../../domain/roulette.event';

export type SelectWinnerUseCaseProps = { raffle: Raffle; value: number };

export class SelectWinnerUseCase extends AdminUseCase<SelectWinnerUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super();
  }

  protected async next({ raffle, value }: SelectWinnerUseCaseProps): Promise<E.Either<void, void>> {
    assert(raffle.is.purchased, 'Cannot select winner for a raffle not purchased');

    this.start();
    const result = await transaction(raffle).run(() => {
      raffle.action.number(value).switch.winner();
      return this.raffleRepository.update(raffle);
    });
    result.mapRight((raffle) => this.bus.publish(new WinnerSelectedEvent(raffle)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
