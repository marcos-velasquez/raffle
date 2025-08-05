import { Provider } from '@angular/core';
import { Scheme } from '@ui/services/config';
import { provideUi as provideUiImpl } from '@ui/ui.provider';

export const provideUi = (): Array<Provider> => {
  return [provideUiImpl({ config: { layout: 'basic', scheme: Scheme.AUTO } })];
};
