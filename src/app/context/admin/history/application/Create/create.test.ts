import * as E from '@sweet-monads/either';
import { EitherBuilder, BaseRepository, bus } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { History } from '@context/admin/history/domain/history';
import { HistoryCreatedEvent } from '../../domain/history.event';
import { CreateHistoryUseCase } from './create.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('CreateHistoryUseCase', () => {
  let useCase: CreateHistoryUseCase;
  let mockHistoryRepositoryService: Partial<jest.Mocked<BaseRepository<History>>>;

  beforeEach(() => {
    mockHistoryRepositoryService = { save: jest.fn() };
    useCase = new CreateHistoryUseCase(mockHistoryRepositoryService as BaseRepository<History>);
  });

  it('should publish HistoryCreated event and complete with success message on successful create', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('winner').build();
    const file = new File([new Blob()], 'text.webm', { type: 'video/webm' });
    const primitives = { file, raffle: raffle.toPrimitives() };
    const history = History.create(primitives);

    mockHistoryRepositoryService.save?.mockResolvedValue(E.right(history));

    const result = await useCase['next'](primitives);

    expect(mockHistoryRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(mockHistoryRepositoryService.save).toHaveBeenCalledWith(
      expect.objectContaining({ ...History.create(primitives), id: expect.anything() })
    );
    expect(bus.publish).toHaveBeenCalledWith(new HistoryCreatedEvent(history));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(history)).build());
  });

  it('should complete with error message on failed create', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('winner').build();
    const file = new File([new Blob()], 'text.webm', { type: 'video/webm' });
    const primitives = { file, raffle: raffle.toPrimitives() };
    const error = new Error('Create History failed');

    mockHistoryRepositoryService.save?.mockResolvedValue(E.left(error));

    const result = await useCase['next'](primitives);

    expect(mockHistoryRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(mockHistoryRepositoryService.save).toHaveBeenCalledWith(
      expect.objectContaining({ ...History.create(primitives), id: expect.anything() })
    );
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });
});
