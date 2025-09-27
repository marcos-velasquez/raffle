import { HistoryUpdater } from '../history-updater';
import { RaffleMother } from '../../../../shared/domain/__tests__/builders/raffle.mother.test';

describe('HistoryUpdater entity', () => {
  const validFile = { type: 'image/jpeg' } as File;

  const historyPrimitives = {
    id: 'test-history-id',
    raffle: RaffleMother.completed(),
    video: 'test-video-url.mp4',
    deliveryReceipt: undefined,
  };

  it('should create a HistoryUpdater with valid image file and history', () => {
    const historyUpdater = HistoryUpdater.from({
      history: historyPrimitives,
      deliveryReceipt: validFile,
    });

    expect(historyUpdater).toBeInstanceOf(HistoryUpdater);
  });

  it('should throw if file is not an image', () => {
    const invalidFile = { type: 'video/mp4' } as File;
    expect(() =>
      HistoryUpdater.from({
        history: historyPrimitives,
        deliveryReceipt: invalidFile,
      })
    ).toThrow('Invalid file format');
  });

  it('should return correct primitives', () => {
    const historyUpdater = HistoryUpdater.from({
      history: historyPrimitives,
      deliveryReceipt: validFile,
    });

    const primitives = historyUpdater.toPrimitives();

    expect(primitives.deliveryReceipt).toBe(validFile);
    expect(primitives.history.id).toBe(historyPrimitives.id);
    expect(primitives.history.video).toBe(historyPrimitives.video);
    expect(primitives.history.deliveryReceipt).toBe(historyPrimitives.deliveryReceipt);
  });
});
