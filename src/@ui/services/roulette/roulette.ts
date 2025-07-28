// @ts-ignore
import { Wheel } from 'spin-wheel';
import { Random, seg } from '@shared/domain';
import { DEFAULT_ROULETTE_PROPS } from './roulette-props';

export type RouletteProps = { el: HTMLElement; labels: string[] };

export class Roulette {
  private readonly wheel: Wheel;

  constructor(props: RouletteProps) {
    this.wheel = new Wheel(props.el, { ...DEFAULT_ROULETTE_PROPS, items: props.labels.map((label) => ({ label })) });
    const image = new Image();
    image.src = 'images/roulette-overlay.svg';
    image.onload = () => {
      this.wheel.overlayImage = image;
    };
  }

  public spin(): Promise<number> {
    return new Promise((resolve) => {
      const winner = Random.from(this.wheel.items);
      const revolution = Random.int(7, 15);
      const duration = seg(10);
      this.wheel.onRest = () => resolve(winner);
      this.wheel.spinToItem(winner, duration, false, revolution);
    });
  }

  public destroy() {
    this.wheel.remove();
  }
}
