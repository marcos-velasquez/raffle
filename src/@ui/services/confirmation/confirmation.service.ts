import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { is } from '@shared/domain';

export type ConfirmationProps = { message: string };
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly defaultProps: ConfirmationProps = { message: 'Estas seguro de realizar esta acción?' };

  public open(props: Partial<ConfirmationProps> = {}) {
    const userProps = merge({}, this.defaultProps, props);
    return is.affirmative(window.confirm(userProps.message));
  }
}

export const confirmation = new ConfirmationService();
