import { is } from '@shared/domain';

export enum Scheme {
  AUTO = 'auto',
  DARK = 'night',
  LIGHT = 'light',
}

export interface UiConfig {
  layout: string;
  scheme: Scheme;
}

export const scheme = (scheme: Scheme) => ({
  is: {
    auto: is.affirmative(scheme === Scheme.AUTO),
    dark: is.affirmative(scheme === Scheme.DARK),
    light: is.affirmative(scheme === Scheme.LIGHT),
  },
});
