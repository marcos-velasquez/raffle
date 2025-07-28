import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder';
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

    const result = await useCase.execute(validInput);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validInput.raffle));
    expect(validInput.raffle.get.number(validInput.value).is.inVerification).toBe(true);
    expect(validInput.value).toEqual(
      expect.objectContaining(validInput.raffle.get.number(validInput.value).get.payer.toPrimitives())
    );
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new BuyNumberEvent(validInput.raffle, validInput.value) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validInput.raffle)).build());
  });

  it('should complete with error message on failed buy', async () => {
    const error = new Error('Buy number failed');
    mockRaffleRepositoryService.update?.mockResolvedValue(E.left(error));

    const result = await useCase.execute(validInput);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validInput.raffle));
    expect(validInput.raffle.get.number(validInput.value).is.inPayment).toBe(true);
    expect(validInput.raffle.get.number(validInput.value).has.payer).toBe(false);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error message on failed buy number with not inPayment', async () => {
    const raffle = new RaffleBuilder().build();

    await expect(() => useCase.execute({ ...validInput, raffle })).rejects.toThrow();
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });
});
