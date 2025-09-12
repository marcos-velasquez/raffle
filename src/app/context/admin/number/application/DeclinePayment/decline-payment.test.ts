import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { BaseRepository, EitherBuilder, Exception, object } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { DeclinePaymentUseCase, DeclinePaymentUseCaseProps } from './decline-payment.usecase';
import { PaymentDeclinedEvent } from '../../domain/number.event';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('DeclinePaymentUseCase', () => {
  let useCase: DeclinePaymentUseCase;
  let mockRaffleRepository: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validProps: DeclinePaymentUseCaseProps;

  beforeEach(() => {
    mockRaffleRepository = { update: jest.fn() };
    useCase = new DeclinePaymentUseCase(mockRaffleRepository as BaseRepository<Raffle>);
    validProps = {
      raffle: new RaffleBuilder().withNumber(1).payer.random().build(),
      value: 1,
    };
  });

  it('should publish PaymentDeclined event and complete with success message on successful update', async () => {
    mockRaffleRepository.update?.mockResolvedValue(E.right(validProps.raffle));
    validProps.raffle.get.number(1).switch.inPayment();
    const declinedRaffle = object.clone(validProps.raffle);

    const result = await useCase['next'](validProps);

    expect(validProps.raffle.is.number(1).available).toBe(true);
    expect(validProps.raffle.get.number(1).has.payer).toBe(false);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validProps.raffle);
    expect(bus.publish).toHaveBeenCalledWith(new PaymentDeclinedEvent(declinedRaffle, validProps.value));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validProps.raffle)).build());
  });

  it('should complete with error message on failed decline payment', async () => {
    const exception = new Exception('decline payment failed');
    mockRaffleRepository.update?.mockResolvedValue(E.left(exception));
    validProps.raffle.get.number(1).switch.inPayment();

    const result = await useCase['next'](validProps);

    expect(validProps.raffle.is.number(1).available).toBe(false);
    expect(validProps.raffle.get.number(1).has.payer).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validProps.raffle);
    expect(bus.publish).toHaveBeenCalledWith({ exception });
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should complete with error with not found number decline payment', async () => {
    const invalidInput = { ...validProps, value: validProps.raffle.numbers.length + 1 };

    await expect(() => useCase['next'](invalidInput)).rejects.toThrow();
  });

  it('should complete with error with invalid state decline payment', async () => {
    const availableRaffle = new RaffleBuilder().withNumber(1).state('available').build();
    await expect(() => useCase['next']({ ...validProps, raffle: availableRaffle })).rejects.toThrow();

    const purchasedRaffle = new RaffleBuilder().withNumber(1).state('purchased').build();
    await expect(() => useCase['next']({ ...validProps, raffle: purchasedRaffle })).rejects.toThrow();
  });
});
