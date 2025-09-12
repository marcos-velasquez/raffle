import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { PayerBuilder } from '@context/shared/domain/__tests__/builders/payer.builder.test';
import { Raffle } from '@context/shared/domain/raffle';
import { BuyNumberEvent } from '../../domain/number.event';
import { BuyNumberUseCase, BuyNumberUseCaseProps } from './buy.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('BuyNumberUseCase', () => {
  let useCase: BuyNumberUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validProps: BuyNumberUseCaseProps;

  beforeEach(() => {
    mockRaffleRepositoryService = { update: jest.fn() };
    useCase = new BuyNumberUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
    validProps = {
      raffle: new RaffleBuilder().withNumber(1).state('inPayment').build(),
      value: 1,
    };
  });

  it('should publish BuyNumberEvent and complete with success message on successful buy', async () => {
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(validProps.raffle));
    const payer = PayerBuilder.random();

    const result = await useCase.execute(validProps).complete(payer);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validProps.raffle));
    expect(validProps.raffle.get.number(validProps.value).is.inVerification).toBe(true);
    expect(validProps.raffle.get.number(validProps.value).has.payer).toBe(true);
    expect(validProps.raffle.get.number(validProps.value).get.payer.toPrimitives()).toEqual(payer);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new BuyNumberEvent(validProps.raffle, validProps.value) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validProps.raffle)).build());
  });

  it('should complete with error message on failed buy', async () => {
    const exception = new Exception('Buy number failed');
    mockRaffleRepositoryService.update?.mockResolvedValue(E.left(exception));
    const payer = PayerBuilder.random();

    const result = await useCase.execute(validProps).complete(payer);

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(validProps.raffle));
    expect(validProps.raffle.get.number(validProps.value).is.inPayment).toBe(true);
    expect(validProps.raffle.get.number(validProps.value).has.payer).toBe(false);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should complete with error message on failed buy number with not inPayment', async () => {
    const raffle = new RaffleBuilder().build();
    await expect(() => useCase.execute({ ...validProps, raffle }).complete(PayerBuilder.random())).rejects.toThrow();
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should throw if trying to buy a number that is not inPayment', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').build();
    const props = { raffle, value: 1 };
    await expect(() => useCase.execute(props).complete(PayerBuilder.random())).rejects.toThrow();
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should allow cancelling a buy inPayment and update the repository', () => {
    const props = {
      raffle: new RaffleBuilder().withNumber(1).state('inPayment').build(),
      value: 1,
    };
    useCase.execute(props).cancel();
    expect(props.raffle.get.number(props.value).is.available).toBe(true);
  });
});
