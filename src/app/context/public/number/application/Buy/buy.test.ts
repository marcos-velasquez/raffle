import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { PayerBuilder } from '@context/shared/domain/__tests__/builders/payer.builder.test';
import { Raffle } from '@context/shared/domain/raffle';
import { BuyNumberEvent } from '../../domain/number.event';
import { BuyNumberUseCase, BuyNumberUseCaseProps } from './buy.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('BuyNumberUseCase', () => {
  let useCase: BuyNumberUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validInput: BuyNumberUseCaseProps;

  beforeEach(() => {
    mockRaffleRepositoryService = { update: jest.fn() };
    useCase = new BuyNumberUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
    validInput = {
      raffle: new RaffleBuilder().withNumber(1).state('inPayment').build(),
      value: 1,
    };
  });

  it('should publish BuyNumberEvent and complete with success message on successful buy', async () => {
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(validInput.raffle));
    const payer = PayerBuilder.random();

    const result = await useCase.execute(validInput).complete(payer);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validInput.raffle));
    expect(validInput.raffle.get.number(validInput.value).is.inVerification).toBe(true);
    expect(validInput.raffle.get.number(validInput.value).has.payer).toBe(true);
    expect(validInput.raffle.get.number(validInput.value).get.payer.toPrimitives()).toEqual(payer);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new BuyNumberEvent(validInput.raffle, validInput.value) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validInput.raffle)).build());
  });

  it('should complete with error message on failed buy', async () => {
    const error = new Error('Buy number failed');
    mockRaffleRepositoryService.update?.mockResolvedValue(E.left(error));
    const payer = PayerBuilder.random();

    const result = await useCase.execute(validInput).complete(payer);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validInput.raffle));
    expect(validInput.raffle.get.number(validInput.value).is.inPayment).toBe(true);
    expect(validInput.raffle.get.number(validInput.value).has.payer).toBe(false);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error message on failed buy number with not inPayment', async () => {
    const raffle = new RaffleBuilder().build();
    await expect(() => useCase.execute({ ...validInput, raffle }).complete(PayerBuilder.random())).rejects.toThrow();
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should throw if trying to buy a number that is not inPayment', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').build();
    const input = { raffle, value: 1 };
    await expect(() => useCase.execute(input).complete(PayerBuilder.random())).rejects.toThrow(
      'El número debe estar en proceso de pago'
    );
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should allow cancelling a buy inPayment and update the repository', () => {
    const input = {
      raffle: new RaffleBuilder().withNumber(1).state('inPayment').build(),
      value: 1,
    };
    useCase.execute(input).cancel();
    expect(input.raffle.get.number(input.value).is.available).toBe(true);
  });
});
