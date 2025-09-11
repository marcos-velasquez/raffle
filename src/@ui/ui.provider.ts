import { EnvironmentProviders, Provider, inject, provideEnvironmentInitializer } from '@angular/core';
import { UI_CONFIG, UiConfig } from './services/config';
import { ConfirmationService } from './services/confirmation';
import { MediaWatcherService } from './services/media-watcher';
import { SplashScreenService } from './services/splash-screen';
import { LoadingBarService } from './services/loading';

export type UiProviderConfig = { config?: UiConfig };

export const provideUi = ({ config }: UiProviderConfig): Array<Provider | EnvironmentProviders> => {
  const providers: Array<Provider | EnvironmentProviders> = [
    { provide: UI_CONFIG, useValue: config ?? {} },
    provideEnvironmentInitializer(() => inject(ConfirmationService)),
    provideEnvironmentInitializer(() => inject(LoadingBarService)),
    provideEnvironmentInitializer(() => inject(MediaWatcherService)),
    provideEnvironmentInitializer(() => inject(SplashScreenService)),
  ];

  return providers;
};
