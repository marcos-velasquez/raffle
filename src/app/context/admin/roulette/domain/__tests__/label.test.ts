import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder';
import { Label } from '../label';

describe('Labels', () => {
  it('should generate labels from raffle payers', () => {
    const raffle = new RaffleBuilder().withNumbers().payer.random().build();

    const result = Label.many(raffle);

    expect(result).toEqual(expect.arrayContaining([expect.stringMatching(/^\d+\. [A-Za-z]+$/)]));
  });

  it('should return an empty array if there are no payers', () => {
    const raffle = new RaffleBuilder().build();

    const result = Label.many(raffle);

    expect(result).toEqual([]);
  });
});
