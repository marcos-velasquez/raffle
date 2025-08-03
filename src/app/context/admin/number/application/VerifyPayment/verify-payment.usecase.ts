import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { assert, BaseRepository, boolean, EitherBuilder, transaction } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { AdminUseCase } from '../../../shared/application';
import { PaymentVerifiedEvent } from '../../domain';

export type VerifyPaymentUseCaseProps = { raffle: Raffle; value: number };

export class VerifyPaymentUseCase extends AdminUseCase<VerifyPaymentUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(progressBuilder().withStart('Verificando pago...').withComplete('Pago verificado con éxito').build());
  }

  protected async next({ raffle, value }: VerifyPaymentUseCaseProps): Promise<E.Either<void, void>> {
    assert(boolean(raffle.is.number(value)), 'Number not found');
    assert(raffle.is.number(value).inVerification, 'Cannot verify payment for a number that is not in verification');

    this.start();
    const result = await transaction(raffle).run(() => {
      raffle.action.number(value).switch.purchased();
      return this.raffleRepository.update(raffle);
    });
    result.mapRight((raffle) => this.bus.publish(new PaymentVerifiedEvent(raffle, value)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
