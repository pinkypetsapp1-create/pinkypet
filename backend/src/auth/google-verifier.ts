import { Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ENV, Env } from '../config/env';

export interface GoogleIdentity {
  sub: string;
  email: string;
}

/** Comprueba con Google que el «ID token» es auténtico, para uno de nuestros clientes y con el correo verificado. */
export abstract class GoogleVerifier {
  abstract verify(idToken: string): Promise<GoogleIdentity | null>;
}

@Injectable()
export class GoogleAuthLibraryVerifier extends GoogleVerifier {
  private readonly client = new OAuth2Client();
  constructor(@Inject(ENV) private readonly env: Env) {
    super();
  }

  async verify(idToken: string): Promise<GoogleIdentity | null> {
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: this.env.googleClientIds });
      const p = ticket.getPayload();
      if (!p?.sub || !p.email || p.email_verified !== true) return null;
      return { sub: p.sub, email: p.email };
    } catch {
      return null;
    }
  }
}
