import { Raffle } from '../../../shared/domain';
import { HistoryBuilder } from './builders/history.builder.test';

describe('History', () => {

  describe('History', () => {
    it('should throw an error if video is empty', () => {
      expect(() => new HistoryBuilder().withEmptyVideo().build()).toThrow();
    });

    it('should throw an error if raffle is not completed', () => {
      expect(() => new HistoryBuilder().withIncompleteRaffle().build()).toThrow();
    });

    it('should reconstruct a History instance from primitives', () => {
      const historyBuilder = new HistoryBuilder().withDeliveryReceipt('https://example.com/delivery-receipt.pdf');
      const history = historyBuilder.build();
      const primitives = historyBuilder.buildPrimitives();

      expect(history.getId()).toBe(primitives.id);
      expect(history.video).toBe(primitives.video);
      expect(history.raffle).toBeInstanceOf(Raffle);
      expect(history.raffle.is.completed).toBe(true);
      expect(history.raffle.has.winner).toBe(true);
      expect(history.deliveryReceipt).toBe(primitives.deliveryReceipt);
    });

    it('should convert a History instance to primitives correctly', () => {
      const historyBuilder = new HistoryBuilder().withDeliveryReceipt('https://example.com/delivery-receipt.pdf');
      const history = historyBuilder.build();
      const primitives = history.toPrimitives();
      const originalPrimitives = historyBuilder.buildPrimitives();

      expect(primitives.id).toBe(originalPrimitives.id);
      expect(primitives.video).toBe(originalPrimitives.video);
      expect(primitives.raffle.title).toBe(originalPrimitives.raffle.title);
      expect(primitives.raffle.completed).toBe(true);
      expect(primitives.raffle.numbers).toHaveLength(originalPrimitives.raffle.numbers.length);
      expect(primitives.deliveryReceipt).toBe(originalPrimitives.deliveryReceipt);
    });
  });
});
