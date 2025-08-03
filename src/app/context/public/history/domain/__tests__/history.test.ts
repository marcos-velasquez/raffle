import { Raffle } from '../../../../shared/domain/raffle';
import { History, HistoryPrimitives } from '../history';
import { RaffleBuilder } from '../../../../shared/domain/__tests__/builders/raffle.builder.test';

describe('History', () => {
  const validHistoryPrimitives: HistoryPrimitives = {
    id: 'history-id',
    video: 'https://example.com/video.mp4',
    raffle: new RaffleBuilder().withNumber(1).state('winner').build().toPrimitives(),
  };

  describe('History', () => {
    it('should create a History instance correctly', () => {
      const history = History.from(validHistoryPrimitives);

      expect(history.raffle).toBeInstanceOf(Raffle);
      expect(history.video).toBe(validHistoryPrimitives.video);
      expect(history.toPrimitives()).toEqual({ ...validHistoryPrimitives, id: expect.anything() });
    });

    it('should throw an error if video is empty', () => {
      expect(() => History.from({ ...validHistoryPrimitives, video: '' })).toThrow();
    });

    it('should throw an error if raffle is not completed', () => {
      const raffle = new RaffleBuilder().build();
      expect(() => History.from({ ...validHistoryPrimitives, raffle: raffle.toPrimitives() })).toThrow();
    });

    it('should reconstruct a History instance from primitives', () => {
      const history = History.from(validHistoryPrimitives);

      expect(history.getId()).toBe(validHistoryPrimitives.id);
      expect(history.video).toBe(validHistoryPrimitives.video);
      expect(history.raffle).toBeInstanceOf(Raffle);
      expect(history.toPrimitives()).toEqual({ ...validHistoryPrimitives, id: expect.anything() });
    });

    it('should convert a History instance to primitives correctly', () => {
      const history = History.from(validHistoryPrimitives);

      expect(history.toPrimitives()).toEqual(validHistoryPrimitives);
    });
  });
});
