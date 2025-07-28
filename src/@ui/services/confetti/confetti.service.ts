import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';
import { seg } from '@shared/domain';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private readonly defaults: Partial<ConfettiProps> = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    duration: seg(15),
    interval: 250,
  };

  public start(props: Partial<ConfettiProps> = {}) {
    const options = { ...this.defaults, ...props } as ConfettiProps;
    const animationEnd = Date.now() + options.duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / options.duration);
      confetti({
        ...options,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...options,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, options.interval);
  }
}

interface ConfettiProps extends confetti.Options {
  duration: number;
  interval: number;
}
