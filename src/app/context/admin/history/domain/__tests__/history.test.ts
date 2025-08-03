import { History } from '../history';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleMother } from '../../../../shared/domain/__tests__/builders/raffle.mother.test';

describe('History entity', () => {
  const validFile = { type: 'video/mp4' } as File;

  const completedRafflePrimitives = RaffleMother.completed();
  const incompleteRafflePrimitives = RaffleMother.notCompleted();

  it('should create a History entity with valid file and completed raffle', () => {
    const history = History.create({ file: validFile, raffle: completedRafflePrimitives });
    expect(history).toBeInstanceOf(History);
    expect(history.file).toBe(validFile);
    expect(history.raffle).toBeInstanceOf(Raffle);
    expect(history.raffle.is.completed).toBe(true);
  });

  it('should throw if file is not a video', () => {
    const invalidFile = { type: 'image/png' } as File;
    expect(() => History.create({ file: invalidFile, raffle: completedRafflePrimitives })).toThrow(
      'Invalid file format'
    );
  });

  it('should throw if raffle is not completed', () => {
    expect(() => History.create({ file: validFile, raffle: incompleteRafflePrimitives })).toThrow(
      'Raffle is not completed'
    );
  });

  it('should return correct primitives', () => {
    const history = History.create({ file: validFile, raffle: completedRafflePrimitives });
    const primitives = history.toPrimitives();
    expect(primitives.file).toBe(validFile);
    expect(primitives.raffle).toEqual(history.raffle.toPrimitives());
    expect(primitives.id).toBe(history.getId());
  });
});
