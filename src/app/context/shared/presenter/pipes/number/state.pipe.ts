import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NumberState } from '@context/shared/domain/number';

@Pipe({ name: 'color' })
export class NumberColorStatePipe implements PipeTransform {
  transform(state: NumberState): string {
    return {
      available: 'btn-primary',
      inPayment: 'btn-secondary',
      inVerification: 'btn-warning',
      purchased: 'btn-neutral',
      winner: 'btn-success',
    }[state];
  }
}

@Pipe({ name: 'text' })
export class NumberTextStatePipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(state: NumberState): string {
    return this.transloco.translate(`numberStates.${state}`);
  }
}
