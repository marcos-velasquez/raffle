import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { BaseRepository, EitherBuilder, object } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { DeclinePaymentUseCase, DeclinePaymentUseCaseProps } from './decline-payment.usecase';
import { PaymentDeclinedEvent } from '../../domain/number.event';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('DeclinePaymentUseCase', () => {
  let useCase: DeclinePaymentUseCase;
  let mockRaffleRepository: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validInput: DeclinePaymentUseCaseProps;

  beforeEach(() => {
    mockRaffleRepository = { update: jest.fn() };
    useCase = new DeclinePaymentUseCase(mockRaffleRepository as BaseRepository<Raffle>);
    validInput = {
      raffle: new RaffleBuilder().withNumber(1).payer.random().build(),
      value: 1,
    };
  });

  it('should publish PaymentDeclined event and complete with success message on successful edit', async () => {
    mockRaffleRepository.update?.mockResolvedValue(E.right(validInput.raffle));
    validInput.raffle.get.number(1).switch.inPayment();
    const declinedRaffle = object.clone(validInput.raffle);

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.number(1).available).toBe(true);
    expect(validInput.raffle.get.number(1).has.payer).toBe(false);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith(new PaymentDeclinedEvent(declinedRaffle, validInput.value));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validInput.raffle)).build());
  });

  it('should complete with error message on failed decline payment', async () => {
    const error = new Error('decline payment failed');
    mockRaffleRepository.update?.mockResolvedValue(E.left(error));
    validInput.raffle.get.number(1).switch.inPayment();

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.number(1).available).toBe(false);
    expect(validInput.raffle.get.number(1).has.payer).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith({ error });
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error with not found number decline payment', async () => {
    const invalidInput = { ...validInput, value: validInput.raffle.numbers.length + 1 };

    await expect(() => useCase['next'](invalidInput)).rejects.toThrow();
  });

  it('should complete with error with invalid state decline payment', async () => {
    const availableRaffle = new RaffleBuilder().withNumber(1).state('available').build();
    await expect(() => useCase['next']({ ...validInput, raffle: availableRaffle })).rejects.toThrow();

    const purchasedRaffle = new RaffleBuilder().withNumber(1).state('purchased').build();
    await expect(() => useCase['next']({ ...validInput, raffle: purchasedRaffle })).rejects.toThrow();
  });
});
