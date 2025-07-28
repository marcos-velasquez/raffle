import * as E from '@sweet-monads/either';
import { progressBuilder, UseCase } from '@shared/application';
import { assert, BaseRepository, EitherBuilder, transaction, when } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { PayerPrimitives } from '@context/shared/domain';
import { BuyNumberEvent } from '../../domain/number.event';

export type BuyNumberUseCaseProps = { raffle: Raffle; value: number };

export type BuyNumberOutput = {
  start: () => void;
  complete: (payer: PayerPrimitives) => Promise<E.Either<void, void>>;
  cancel: () => void;
};

export class BuyNumberUseCase extends UseCase<BuyNumberUseCaseProps, BuyNumberOutput> {
  constructor(private readonly raffleRepository: BaseRepository<Raffle>) {
    super(
      progressBuilder()
        .withStart('Comprando número...')
        .withComplete('Su compra será verificada por un administrador.')
        .build()
    );
  }

  public execute({ raffle, value }: BuyNumberUseCaseProps): BuyNumberOutput {
    const number = raffle.get.number(value);
    return {
      start: () => {
        assert(number.is.available, 'El número no está disponible');
        when(number.switch.inPayment()).map(() => this.raffleRepository.update(raffle));
      },
      complete: async (payer: PayerPrimitives) => {
        assert(number.is.inPayment, 'El número debe estar en proceso de pago');
        this.start();
        const result = await transaction(raffle).run(() => {
          number.action.create.payer(payer);
          number.switch.inVerification();
          return this.raffleRepository.update(raffle);
        });
        result.mapRight((raffle) => this.bus.publish(new BuyNumberEvent(raffle, value)));
        this.complete(result);
        return new EitherBuilder().fromEitherToVoid(result).build();
      },
      cancel: () => {
        assert(number.is.inPayment, 'El número debe estar en proceso de pago');
        when(number.switch.available()).map(() => this.raffleRepository.update(raffle));
      },
    };
  }
}
