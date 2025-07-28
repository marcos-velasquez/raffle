import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { assert, boolean } from '@shared/domain';
import { Roulette, RouletteProps } from './roulette';

@Injectable({ providedIn: 'root' })
export class RouletteService {
  private roulette!: Roulette;

  public set props(props: RouletteProps) {
    this.roulette = new Roulette(props);
  }

  public spin() {
    assert(boolean(this.roulette), 'The roulette must be configured');
    return from(this.roulette.spin());
  }

  public destroy() {
    assert(boolean(this.roulette), 'The roulette must be configured');
    this.roulette.destroy();
  }
}
