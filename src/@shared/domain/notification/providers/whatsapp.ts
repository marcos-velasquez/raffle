import { environment } from '@env/environment';
import { Notification } from '../notification';

export class Whatsapp extends Notification<WhatsappProps> {
  private readonly WHATSAPP_API_URL = environment.WHATSAPP_API_URL;

  public async send() {
    fetch(this.WHATSAPP_API_URL, {
      method: 'POST',
      body: JSON.stringify({ to: this.props.to, message: this.props.message }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public static message(message: string) {
    return {
      to: (to: string) => {
        return new Whatsapp({ to, message });
      },
    };
  }
}

export type WhatsappProps = {
  to: string;
  message: string;
};
