import { Injectable } from '@angular/core';
import { is, object } from '@shared/domain';

export type ConfirmationProps = { message: string };
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly defaultProps: ConfirmationProps = { message: 'Estas seguro de realizar esta acción?' };

  public open(props: Partial<ConfirmationProps> = {}) {
    return is.affirmative(window.confirm(object.merge(this.defaultProps, props).message));
  }
}

export const confirmation = new ConfirmationService();
