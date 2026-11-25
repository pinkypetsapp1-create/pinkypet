import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from '../../environments/environment';

/**
 * «Continuar con Google» (decisión del equipo, 2026-11-24). En Android usa el selector de cuentas nativo;
 * en el navegador, Google Identity Services. Devuelve el ID token que el backend verifica (POST /auth/google).
 */
@Injectable({ providedIn: 'root' })
export class Google {
  /** En iOS hace falta además su propio cliente OAuth (googleIosClientId); sin él, el botón no se muestra. */
  readonly enabled = !!environment.googleWebClientId && (Capacitor.getPlatform() !== 'ios' || !!environment.googleIosClientId);
  private ready: Promise<void> | null = null;

  /** null si la persona cierra el selector de Google sin elegir cuenta. */
  async idToken(): Promise<string | null> {
    // En la web, Google abre una ventana emergente y vuelve a una URL fija, que debe estar en
    // «URIs de redireccionamiento autorizados» del cliente OAuth (docs/DEPLOY.md, paso 3).
    this.ready ??= SocialLogin.initialize({
      google: Capacitor.isNativePlatform()
        ? // Android (Credential Manager): el ID web va en webClientId; el cliente Android solo registra paquete + SHA-1.
          // Solo hace falta el idToken, así que se omite la autorización extra (en BridgeActivity puede colgarse).
          { webClientId: environment.googleWebClientId, iOSClientId: environment.googleIosClientId || undefined, iOSServerClientId: environment.googleWebClientId, mode: 'online', skipAuthOnlyAuthorizationAfterSignIn: true }
        : { webClientId: environment.googleWebClientId, mode: 'online', redirectUrl: `${window.location.origin}/` },
    });
    await this.ready;
    try {
      // En Android no se pasan scopes: con la BridgeActivity estándar Google los rechaza (ya incluye email y perfil).
      const options = Capacitor.isNativePlatform() ? {} : { scopes: ['email', 'profile'] };
      const r = await SocialLogin.login({ provider: 'google', options });
      const result = r.result as { idToken?: string | null };
      return result.idToken ?? null;
    } catch (e) {
      if (/cancel/i.test(String((e as Error)?.message ?? e))) return null;
      throw e;
    }
  }
}
