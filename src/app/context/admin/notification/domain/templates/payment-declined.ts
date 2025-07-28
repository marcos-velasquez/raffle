import { Template } from '../template';

export class PaymentDeclinedTemplate extends Template {
  public toString(): string {
    return `Estimado/a ${this.payer.name}, le informamos que el pago correspondiente a la compra del número (${this.value}) para la rifa "${this.raffle.title}" ha sido rechazado. Si considera que esto es un error, le invitamos a comunicarse con nuestro equipo de soporte a la brevedad.`;
  }
}
