import { Injectable } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from '../../environments/environment';

/**
 * «Continuar con Google» (decisión del equipo, 2026-11-24). En Android usa el selector de cuentas nativo;
 * en el navegador, Google Identity Services. Devuelve el ID token que el backend verifica (POST /auth/google).
 */
@Injectable({ providedIn: 'root' })
export class Google {
  readonly enabled = !!environment.googleWebClientId;
  private ready: Promise<void> | null = null;

  /** null si la persona cierra el selector de Google sin elegir cuenta. */
  async idToken(): Promise<string | null> {
    this.ready ??= SocialLogin.initialize({ google: { webClientId: environment.googleWebClientId, mode: 'online' } });
    await this.ready;
    try {
      const r = await SocialLogin.login({ provider: 'google', options: { scopes: ['email', 'profile'] } });
      const result = r.result as { idToken?: string | null };
      return result.idToken ?? null;
    } catch (e) {
      if (/cancel/i.test(String((e as Error)?.message ?? e))) return null;
      throw e;
    }
  }
}
