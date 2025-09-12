import { History, HistoryPrimitives } from '../../history';
import { RaffleBuilder } from './raffle.builder.test';

export class HistoryBuilder {
  protected readonly primitives: HistoryPrimitives = {
    id: 'test-history-id',
    video: 'https://example.com/video.mp4',
    raffle: RaffleBuilder.completed().buildPrimitives(),
    deliveryReceipt: undefined,
  };

  public withId(id: string): this {
    this.primitives.id = id;
    return this;
  }

  public withVideo(video: string): this {
    this.primitives.video = video;
    return this;
  }

  public withRaffle(raffle: HistoryPrimitives['raffle']): this {
    this.primitives.raffle = raffle;
    return this;
  }

  public withDeliveryReceipt(deliveryReceipt: string): this {
    this.primitives.deliveryReceipt = deliveryReceipt;
    return this;
  }

  public withoutDeliveryReceipt(): this {
    this.primitives.deliveryReceipt = undefined;
    return this;
  }

  public withEmptyVideo(): this {
    this.primitives.video = '';
    return this;
  }

  public withIncompleteRaffle(): this {
    this.primitives.raffle = new RaffleBuilder().buildPrimitives();
    return this;
  }

  public build(): History {
    return History.from(this.primitives);
  }

  public buildPrimitives(): HistoryPrimitives {
    return { ...this.primitives };
  }

  public static random(): HistoryBuilder {
    const randomId = Math.random().toString(36).substring(7);
    return new HistoryBuilder()
      .withId(`history-${randomId}`)
      .withVideo(`https://example.com/video-${randomId}.mp4`)
      .withRaffle(RaffleBuilder.random().withCompleted(true).withNumber(1).state('winner').buildPrimitives());
  }

  public static withVideo(video: string): HistoryBuilder {
    return new HistoryBuilder().withVideo(video);
  }

  public static withDeliveryReceipt(deliveryReceipt: string): HistoryBuilder {
    return new HistoryBuilder().withDeliveryReceipt(deliveryReceipt);
  }

  public static completed(): HistoryBuilder {
    return new HistoryBuilder()
      .withDeliveryReceipt('https://example.com/delivery-receipt.pdf');
  }
}

describe('HistoryBuilder util', () => {
  it('should build a history with default values', () => {
    const history = new HistoryBuilder().build();
    expect(history.video).toBe('https://example.com/video.mp4');
    expect(history.raffle.is.completed).toBe(true);
    expect(history.deliveryReceipt).toBeUndefined();
  });

  it('should build a history with custom values', () => {
    const customVideo = 'https://custom.com/video.mp4';
    const customReceipt = 'https://custom.com/receipt.pdf';
    
    const history = new HistoryBuilder()
      .withVideo(customVideo)
      .withDeliveryReceipt(customReceipt)
      .build();
    
    expect(history.video).toBe(customVideo);
    expect(history.deliveryReceipt).toBe(customReceipt);
  });

  it('should create random histories', () => {
    const history1 = HistoryBuilder.random().build();
    const history2 = HistoryBuilder.random().build();
    
    expect(history1.video).not.toBe(history2.video);
    expect(history1.getId()).not.toBe(history2.getId());
  });

  it('should throw error when building with empty video', () => {
    expect(() => {
      new HistoryBuilder().withEmptyVideo().build();
    }).toThrow();
  });

  it('should throw error when building with incomplete raffle', () => {
    expect(() => {
      new HistoryBuilder().withIncompleteRaffle().build();
    }).toThrow();
  });
});
