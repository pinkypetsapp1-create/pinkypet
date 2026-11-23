import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

const KEY = 'pp.refresh';

/**
 * Dónde se guarda el token de renovación (decisión D2, docs/SPEC.md):
 * - Android: almacén seguro del sistema (Android Keystore) mediante @aparajita/capacitor-secure-storage.
 * - Navegador: sessionStorage. Se borra al cerrar la pestaña y el token rota en cada uso.
 *   Compromiso: un script malicioso en la página podría leerlo; la opción más segura (cookie httpOnly)
 *   obligaría a cambiar el backend.
 * El token de acceso (15 min) vive solo en memoria.
 */
@Injectable({ providedIn: 'root' })
export class TokenStore {
  private readonly native = Capacitor.isNativePlatform();

  async getRefresh(): Promise<string | null> {
    try {
      if (this.native) return ((await SecureStorage.get(KEY)) as string | null) ?? null;
      return sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  async setRefresh(token: string | null): Promise<void> {
    try {
      if (this.native) {
        if (token) await SecureStorage.set(KEY, token);
        else await SecureStorage.remove(KEY);
      } else if (token) sessionStorage.setItem(KEY, token);
      else sessionStorage.removeItem(KEY);
    } catch {
      /* sin almacenamiento: la sesión dura lo que dure la app abierta */
    }
  }
}
