import { Whatsapp } from '@shared/domain';
import { Template } from './template';

export class WhatsappSender {
  private constructor(private readonly template: Template) {}

  public send(): void {
    const message = this.template.toString();
    const to = this.template.payer.phone;
    Whatsapp.message(message).to(to).send();
  }

  public static create(template: Template): WhatsappSender {
    return new WhatsappSender(template);
  }
}
