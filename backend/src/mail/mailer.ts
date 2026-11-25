import { Inject, Injectable, Logger } from '@nestjs/common';
import { ENV, Env } from '../config/env';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/** Envío de correos. En producción, Brevo; sin clave (desarrollo y tests), solo se escribe en el registro. */
export abstract class Mailer {
  abstract send(mail: Mail): Promise<void>;
}

@Injectable()
export class BrevoOrLogMailer extends Mailer {
  private readonly logger = new Logger('Mailer');
  constructor(@Inject(ENV) private readonly env: Env) {
    super();
  }

  async send(mail: Mail): Promise<void> {
    if (!this.env.brevoApiKey) {
      // En local se escribe el correo entero (con el enlace) para poder probarlo; en producción nunca.
      if (this.env.nodeEnv === 'production') this.logger.warn('Falta BREVO_API_KEY: no se ha enviado el correo de recuperación');
      else this.logger.log(`(sin BREVO_API_KEY) Correo para ${mail.to} · ${mail.subject}\n${mail.text}`);
      return;
    }
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': this.env.brevoApiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: this.env.mailFrom, name: 'Pinky Pet' },
        to: [{ email: mail.to }],
        subject: mail.subject,
        textContent: mail.text,
        htmlContent: mail.html,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`Brevo respondió ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}
