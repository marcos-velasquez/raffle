import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { is } from '@shared/domain';

export type ConfirmationProps = { message: string };
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly transloco = inject(TranslocoService);

  public open(props: Partial<ConfirmationProps> = {}) {
    const message = props.message || this.transloco.translate('confirmations.default');
    return is.affirmative(window.confirm(message));
  }
}

export const confirmation = new ConfirmationService();
