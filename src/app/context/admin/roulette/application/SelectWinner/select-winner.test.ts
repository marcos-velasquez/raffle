import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder';
import { WinnerSelectedEvent } from '../../domain/roulette.event';
import { SelectWinnerUseCase, SelectWinnerUseCaseProps } from './select-winner.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('SelectWinnerUseCase', () => {
  let useCase: SelectWinnerUseCase;
  let mockRaffleRepository: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let validInput: SelectWinnerUseCaseProps;

  beforeEach(() => {
    mockRaffleRepository = { update: jest.fn() };
    useCase = new SelectWinnerUseCase(mockRaffleRepository as BaseRepository<Raffle>);
    validInput = {
      raffle: new RaffleBuilder().withNumbers().purchased().build(),
      value: 1,
    };
  });

  it('should publish RaffleEdited event and complete with success message on successful select winner', async () => {
    mockRaffleRepository.update?.mockResolvedValue(E.right(validInput.raffle));

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.completed).toBe(true);
    expect(validInput.raffle.has.winner).toBe(true);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith(new WinnerSelectedEvent(validInput.raffle));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(validInput.raffle)).build());
  });

  it('should complete with error message on failed decline payment', async () => {
    const error = new Error('decline payment failed');
    mockRaffleRepository.update?.mockResolvedValue(E.left(error));

    const result = await useCase['next'](validInput);

    expect(validInput.raffle.is.completed).toBe(false);
    expect(validInput.raffle.has.winner).toBe(false);
    expect(mockRaffleRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepository.update).toHaveBeenCalledWith(validInput.raffle);
    expect(bus.publish).toHaveBeenCalledWith({ error });
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error with raffle is not purchased', async () => {
    const raffle = new RaffleBuilder().build();

    await expect(() => useCase['next']({ ...validInput, raffle })).rejects.toThrow();
  });
});
