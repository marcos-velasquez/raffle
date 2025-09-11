import { Raffle } from '../../../../shared/domain';
import { History, HistoryPrimitives } from '../history';
import { RaffleBuilder } from '../../../../shared/domain/__tests__/builders/raffle.builder.test';

describe('History', () => {
  const createValidHistoryPrimitives = (): HistoryPrimitives => ({
    id: 'history-id',
    video: 'https://example.com/video.mp4',
    raffle: new RaffleBuilder().withNumber(1).state('winner').build().toPrimitives(),
    deliveryReceipt: 'https://example.com/delivery-receipt.pdf',
  });

  describe('History', () => {
    it('should throw an error if video is empty', () => {
      const validHistoryPrimitives = createValidHistoryPrimitives();
      expect(() => History.from({ ...validHistoryPrimitives, video: '' })).toThrow();
    });

    it('should throw an error if raffle is not completed', () => {
      const validHistoryPrimitives = createValidHistoryPrimitives();
      const raffle = new RaffleBuilder().build();
      expect(() => History.from({ ...validHistoryPrimitives, raffle: raffle.toPrimitives() })).toThrow();
    });

    it('should reconstruct a History instance from primitives', () => {
      const validHistoryPrimitives = createValidHistoryPrimitives();
      const history = History.from(validHistoryPrimitives);

      expect(history.getId()).toBe(validHistoryPrimitives.id);
      expect(history.video).toBe(validHistoryPrimitives.video);
      expect(history.raffle).toBeInstanceOf(Raffle);
      expect(history.raffle.is.completed).toBe(true);
      expect(history.raffle.has.winner).toBe(true);
      expect(history.deliveryReceipt).toBe(validHistoryPrimitives.deliveryReceipt);
    });

    it('should convert a History instance to primitives correctly', () => {
      const validHistoryPrimitives = createValidHistoryPrimitives();
      const history = History.from(validHistoryPrimitives);
      const primitives = history.toPrimitives();

      expect(primitives.id).toBe(validHistoryPrimitives.id);
      expect(primitives.video).toBe(validHistoryPrimitives.video);
      expect(primitives.raffle.title).toBe(validHistoryPrimitives.raffle.title);
      expect(primitives.raffle.completed).toBe(true);
      expect(primitives.raffle.numbers).toHaveLength(validHistoryPrimitives.raffle.numbers.length);
      expect(primitives.deliveryReceipt).toBe(validHistoryPrimitives.deliveryReceipt);
    });
  });
});
