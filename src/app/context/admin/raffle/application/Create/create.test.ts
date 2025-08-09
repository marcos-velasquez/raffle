import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleCreatedEvent } from '../../domain/raffle.event';
import { CreateRaffleUseCase } from './create.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('CreateRaffleUseCase', () => {
  let useCase: CreateRaffleUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;

  beforeEach(() => {
    mockRaffleRepositoryService = { save: jest.fn() };
    useCase = new CreateRaffleUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
  });

  it('should publish RaffleCreated event and complete with success message on successful create', async () => {
    const raffle = new RaffleBuilder().build();
    const primitives = { ...raffle.toPrimitives(), quantityNumbers: raffle.numbers.length };
    mockRaffleRepositoryService.save?.mockResolvedValue(E.right(raffle));

    const result = await useCase['next'](primitives);

    expect(mockRaffleRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.save).toHaveBeenCalledWith(
      expect.objectContaining({ ...Raffle.create(primitives), id: expect.anything() })
    );
    expect(bus.publish).toHaveBeenCalledWith(new RaffleCreatedEvent(raffle));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(raffle)).build());
  });

  it('should complete with error message on failed create', async () => {
    const raffle = new RaffleBuilder().build();
    const primitives = { ...raffle.toPrimitives(), quantityNumbers: raffle.numbers.length };
    const exception = new Exception('Create raffle failed');
    mockRaffleRepositoryService.save?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](primitives);

    expect(mockRaffleRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.save).toHaveBeenCalledWith(
      expect.objectContaining({ ...Raffle.create(primitives), id: expect.anything() })
    );
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });
});
