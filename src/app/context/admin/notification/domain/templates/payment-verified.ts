import { Template } from '../template';

export class PaymentVerifiedTemplate extends Template {
  public toString(): string {
    return `Estimado/a ${this.payer.name}, tu pago para el número (${this.value}) de la rifa "${this.raffle.title}" ha sido verificado. ¡Mucha suerte! Si tienes alguna pregunta, no dudes en contactarnos.`;
  }
}
