import { Pipe, PipeTransform } from '@angular/core';
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
  transform(state: NumberState): string {
    return {
      available: 'Disponible',
      inPayment: 'En proceso de pago',
      inVerification: 'En proceso de verificación',
      purchased: 'Apartado',
      winner: 'Ganador',
    }[state];
  }
}
