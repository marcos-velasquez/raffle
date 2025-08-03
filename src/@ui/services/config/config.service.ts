import { inject, Injectable } from '@angular/core';
import { object } from '@shared/domain';
import { BehaviorSubject } from 'rxjs';
import { UI_CONFIG } from './config.constant';
import { Scheme, UiConfig, scheme } from './config.types';
import { ConfigStore } from './config.store';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public readonly config$ = new BehaviorSubject(inject(UI_CONFIG));
  private readonly store = new ConfigStore();

  constructor() {
    this.config = this.store.value;
  }

  public set config(value: Partial<UiConfig>) {
    const config = object.merge(this.config$.getValue(), value);
    this.store.value = config;
    this.config$.next(config);
  }

  public get is() {
    return {
      dark: scheme(this.store.value.scheme).is.dark.isRight(),
    };
  }

  public get switch() {
    return {
      dark: () => {
        this.config = { scheme: Scheme.DARK };
      },
      light: () => {
        this.config = { scheme: Scheme.LIGHT };
      },
    };
  }

  public reset(): void {
    this.config$.next(this.config as Required<UiConfig>);
  }
}
