import { inject, isDevMode, Provider, provideAppInitializer, EnvironmentProviders } from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './transloco.http-loader';

export const provideTranslation = (): Array<Provider | EnvironmentProviders> => {
  const providers: Array<Provider | EnvironmentProviders> = [
    provideTransloco({
      config: {
        availableLangs: ['es', 'en'],
        defaultLang: 'es',
        fallbackLang: 'es',
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);
        return () => firstValueFrom(translocoService.load(defaultLang));
      })();
      return initializerFn();
    }),
  ];

  return providers;
};
