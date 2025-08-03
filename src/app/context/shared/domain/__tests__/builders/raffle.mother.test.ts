import { RaffleBuilder } from './raffle.builder.test';
import { RafflePrimitives } from '../../raffle';

// Test dummy para Jest
describe('RaffleMother util', () => {
  it('dummy', () => {
    expect(true).toBe(true);
  });
});

export class RaffleMother {
  static completed(): RafflePrimitives {
    return new RaffleBuilder()
      .withTitle('Completed')
      .withCompleted(true)
      .withNumber(1)
      .state('winner')
      .build()
      .toPrimitives();
  }

  static notCompleted(): RafflePrimitives {
    return new RaffleBuilder().withTitle('NotCompleted').withCompleted(false).build().toPrimitives();
  }

  static withCustomWinner(value: number): RafflePrimitives {
    return new RaffleBuilder()
      .withTitle('CustomWinner')
      .withCompleted(true)
      .withNumber(value)
      .state('winner')
      .build()
      .toPrimitives();
  }

  static allPurchased(): RafflePrimitives {
    return new RaffleBuilder().withTitle('AllPurchased').withNumbers().purchased().build().toPrimitives();
  }

  static noImages(): RafflePrimitives {
    return new RaffleBuilder().withTitle('NoImages').withImages([]).build().toPrimitives();
  }

  static withPrice(price: number): RafflePrimitives {
    return new RaffleBuilder().withTitle('CustomPrice').withPrice(price).build().toPrimitives();
  }

  static withCustomTitle(title: string): RafflePrimitives {
    return new RaffleBuilder().withTitle(title).build().toPrimitives();
  }

  static withNumberCount(count: number): RafflePrimitives {
    return new RaffleBuilder().withNumbers().count(count).build().toPrimitives();
  }
}
