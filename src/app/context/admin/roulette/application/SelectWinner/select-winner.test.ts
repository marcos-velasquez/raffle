import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { BaseRepository, EitherBuilder, Exception } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { WinnerSelectedEvent } from '../../domain/roulette.event';
import { SelectWinnerUseCase, SelectWinnerUseCaseProps } from './select-winner.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('SelectWinnerUseCase', () => {
  let useCase: SelectWinnerUseCase;
  let mockRaffleRepository: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validProps: SelectWinnerUseCaseProps;

  beforeEach(() => {
    mockRaffleRepository = { update: jest.fn() };
    useCase = new SelectWinnerUseCase(mockRaffleRepository as BaseRepository<Raffle>);
    validProps = {
      raffle: new RaffleBuilder().withNumbers().purchased().build(),
      value: 1,
    };
  });

  it('should publish RaffleUpdated event and complete with success message on successful select winner', async () => {
    mockRaffleRepository.update?.mockResolvedValue(E.right(validProps.raffle));

    const result = await useCase['next'](validProps);

    expect(validProps.raffle.is.completed).toBe(true);
    expect(validProps.raffle.has.winner).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validProps.raffle);
    expect(bus.publish).toHaveBeenCalledWith(new WinnerSelectedEvent(validProps.raffle));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validProps.raffle)).build());
  });

  it('should complete with error message on failed decline payment', async () => {
    const exception = new Exception('decline payment failed');
    mockRaffleRepository.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](validProps);

    expect(validProps.raffle.is.completed).toBe(false);
    expect(validProps.raffle.has.winner).toBe(false);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validProps.raffle);
    expect(bus.publish).toHaveBeenCalledWith({ exception });
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should complete with error with raffle is not purchased', async () => {
    const raffle = new RaffleBuilder().build();

    await expect(() => useCase['next']({ ...validProps, raffle })).rejects.toThrow();
  });
});
