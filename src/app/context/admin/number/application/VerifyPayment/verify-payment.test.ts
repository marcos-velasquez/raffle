import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { PaymentVerifiedEvent } from '../../domain/number.event';
import { VerifyPaymentUseCase, VerifyPaymentUseCaseProps } from './verify-payment.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('VerifyPaymentUseCase', () => {
  let useCase: VerifyPaymentUseCase;
  let mockRaffleRepository: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validInput: VerifyPaymentUseCaseProps;

  beforeEach(() => {
    mockRaffleRepository = { update: jest.fn() };
    useCase = new VerifyPaymentUseCase(mockRaffleRepository as BaseRepository<Raffle>);
    validInput = {
      raffle: new RaffleBuilder().withNumber(1).payer.random().withNumber(1).state('inVerification').build(),
      value: 1,
    };
  });

  it('should publish PaymentVerified event and complete with success message on successful edit', async () => {
    mockRaffleRepository.update?.mockResolvedValue(E.right(validInput.raffle));

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.number(1).purchased).toBe(true);
    expect(validInput.raffle.get.number(1).has.payer).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith(new PaymentVerifiedEvent(validInput.raffle, validInput.value));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validInput.raffle)).build());
  });

  it('should complete with error message on failed verify payment', async () => {
    const error = new Error('verify payment failed');
    mockRaffleRepository.update?.mockResolvedValue(E.left(error));

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.number(1).inVerification).toBe(true);
    expect(validInput.raffle.get.number(1).has.payer).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith({ error });
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error with not found number verify payment', async () => {
    const invalidInput = { ...validInput, value: validInput.raffle.numbers.length + 1 };

    await expect(() => useCase['next'](invalidInput)).rejects.toThrow();
  });

  it('should complete with error with invalid state verify payment', async () => {
    const availableRaffle = new RaffleBuilder().withNumber(1).state('available').build();
    await expect(() => useCase['next']({ ...validInput, raffle: availableRaffle })).rejects.toThrow();

    const inPaymentRaffle = new RaffleBuilder().withNumber(1).state('inPayment').build();
    await expect(() => useCase['next']({ ...validInput, raffle: inPaymentRaffle })).rejects.toThrow();
  });
});
