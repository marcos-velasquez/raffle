import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleRemovedEvent } from '../../domain/raffle.event';
import { RemoveRaffleUseCase } from './remove.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('RemoveRaffleUseCase', () => {
  let useCase: RemoveRaffleUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;

  beforeEach(() => {
    mockRaffleRepositoryService = { remove: jest.fn() };
    useCase = new RemoveRaffleUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
  });

  it('should publish RaffleRemoved event and complete with success message on successful remove', async () => {
    const raffle = new RaffleBuilder().build();
    mockRaffleRepositoryService.remove?.mockResolvedValue(E.right(raffle));

    const result = await useCase['next'](raffle);

    expect(mockRaffleRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.remove).toHaveBeenCalledWith(raffle);
    expect(bus.publish).toHaveBeenCalledWith(new RaffleRemovedEvent(raffle));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(raffle)).build());
  });

  it('should complete with error message on failed remove', async () => {
    const raffle = new RaffleBuilder().build();
    const error = new Error('Create raffle failed');
    mockRaffleRepositoryService.remove?.mockResolvedValue(E.left(error));

    const result = await useCase['next'](raffle);

    expect(mockRaffleRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.remove).toHaveBeenCalledWith(raffle);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error with has purchases number', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').build();

    await expect(() => useCase['next'](raffle)).rejects.toThrow();
  });
});
