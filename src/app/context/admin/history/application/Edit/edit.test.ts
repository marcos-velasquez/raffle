import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { HistoryBuilder } from '@context/shared/domain/__tests__/builders/history.builder.test';
import { HistoryEditedEvent, HistoryUpdater } from '../../domain';
import { EditHistoryUseCase } from './edit.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('EditHistoryUseCase', () => {
  let useCase: EditHistoryUseCase;
  let mockHistoryRepositoryService: Partial<jest.Mocked<BaseRepository<HistoryUpdater>>>;
  let historyUpdater: HistoryUpdater;

  beforeEach(() => {
    mockHistoryRepositoryService = { update: jest.fn() };
    useCase = new EditHistoryUseCase(mockHistoryRepositoryService as BaseRepository<HistoryUpdater>);
    const history = new HistoryBuilder().build();
    const deliveryReceipt = new File([], 'test.jpg', { type: 'image/jpeg' });
    historyUpdater = HistoryUpdater.from({ id: 'test-id', history: history.toPrimitives(), deliveryReceipt });
  });

  it('should publish HistoryEdited event and complete with success message on successful edit', async () => {
    mockHistoryRepositoryService.update?.mockResolvedValue(E.right(historyUpdater));

    const result = await useCase['next'](historyUpdater);

    expect(mockHistoryRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new HistoryEditedEvent(historyUpdater) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(historyUpdater)).build());
  });

  it('should complete with error message on failed edit', async () => {
    const exception = new Exception('Edit history failed');
    mockHistoryRepositoryService.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](historyUpdater);

    expect(mockHistoryRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should throw error when delivery receipt is not an image', () => {
    const invalidFile = new File([], 'test.txt', { type: 'text/plain' });
    const history = new HistoryBuilder().build();
    
    expect(() => HistoryUpdater.from({ 
      id: 'test-id', 
      history: history.toPrimitives(), 
      deliveryReceipt: invalidFile 
    })).toThrow('Invalid file format');
  });

  it('should accept valid image file for delivery receipt', () => {
    const validFile = new File([], 'test.png', { type: 'image/png' });
    const history = new HistoryBuilder().build();
    
    expect(() => HistoryUpdater.from({ 
      id: 'test-id', 
      history: history.toPrimitives(), 
      deliveryReceipt: validFile 
    })).not.toThrow();
  });
});
