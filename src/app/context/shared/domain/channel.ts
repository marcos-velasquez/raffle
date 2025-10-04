import { Entity, assert } from '@shared/domain';

export class Channel extends Entity<ChannelPrimitives> {
  private constructor(
    public readonly currency: string,
    public readonly paymentDetails: string,
    public readonly image: string
  ) {
    super();
    assert(currency.trim().length > 0, 'Currency is required');
    assert(paymentDetails.trim().length > 0, 'Payment details are required');
  }

  public get is() {
    return {
      equal: {
        currency: (value: string) => this.currency === value,
      },
    };
  }

  public get split() {
    return {
      paymentDetails: this.paymentDetails.split(','),
    };
  }

  public get suffix() {
    return {
      currency: (value: number) => `${value} ${this.currency}`,
    };
  }

  public toPrimitives(): ChannelPrimitives {
    return {
      id: this.getId(),
      currency: this.currency,
      paymentDetails: this.paymentDetails,
      image: this.image,
    };
  }

  public static empty(): Channel {
    return new Channel('', '', '');
  }

  public static from(primitives: ChannelPrimitives): Channel {
    return new Channel(primitives.currency, primitives.paymentDetails, primitives.image).withId(primitives.id);
  }

  public static create(primitives: ChannelCreatePrimitives): Channel {
    return new Channel(primitives.currency, primitives.paymentDetails, primitives.image);
  }
}

export type ChannelPrimitives = {
  id: string;
  currency: string;
  paymentDetails: string;
  image: string;
};

export type ChannelUpdatePrimitives = Omit<ChannelPrimitives, 'id'>;
export type ChannelCreatePrimitives = ChannelUpdatePrimitives;
