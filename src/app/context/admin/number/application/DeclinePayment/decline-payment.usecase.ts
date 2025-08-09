import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { assert, BaseRepository, boolean, EitherBuilder, not, object, transaction } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application';
import { PaymentDeclinedEvent } from '../../domain';

export type DeclinePaymentUseCaseProps = { raffle: Raffle; value: number };

export class DeclinePaymentUseCase extends AdminUseCase<DeclinePaymentUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(
      progressBuilder().withStart('progress.decliningPayment').withComplete('progress.paymentDeclinedSuccess').build()
    );
  }

  protected async next({ raffle, value }: DeclinePaymentUseCaseProps): Promise<E.Either<void, void>> {
    assert(boolean(raffle.has.number(value)), 'Number not found');
    assert(not(raffle.is.number(value).available), 'Cannot decline payment for a number that is available');
    assert(not(raffle.is.number(value).purchased), 'Cannot decline payment for a number that is purchased');

    this.start();
    const declinedRaffle = object.clone(raffle);
    const result = await transaction(raffle).run(() => {
      raffle.action.number(value).remove.payer();
      raffle.action.number(value).switch.available();
      return this.raffleRepository.update(raffle);
    });
    result.mapRight(() => this.bus.publish(new PaymentDeclinedEvent(declinedRaffle, value)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
