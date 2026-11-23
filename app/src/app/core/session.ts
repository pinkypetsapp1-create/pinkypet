import { Injectable, computed, inject, signal } from '@angular/core';
import { Api, ApiError } from './api';
import type { CurrentRequest, SessionView, UserView } from './api.types';
import { TokenStore } from './token-store';

/** Estados de usuario que cambian la interfaz (docs/SPEC.md §3). */
export type UserState = 'invitado' | 'registrado' | 'completo' | 'solicitud';

@Injectable({ providedIn: 'root' })
export class Session {
  private readonly api = inject(Api);
  private readonly store = inject(TokenStore);
  private accessToken: string | null = null;
  private accessExpiresAt = 0;
  private refreshing: Promise<boolean> | null = null;

  readonly user = signal<UserView | null>(null);
  readonly request = signal<CurrentRequest | null>(null);
  readonly ready = signal(false);

  readonly state = computed<UserState>(() => {
    const u = this.user();
    if (!u) return 'invitado';
    if (!u.hasTest) return 'registrado';
    return this.request()?.activa ? 'solicitud' : 'completo';
  });
  /** Nombre de la mascota con solicitud en proceso, si la hay. */
  readonly activePetName = computed(() => this.request()?.activa?.mascota.nombre ?? null);

  /** Al arrancar: si hay un token de renovación guardado, recupera la sesión. */
  async restore(): Promise<void> {
    try {
      if (await this.store.getRefresh()) await this.refresh();
    } finally {
      this.ready.set(true);
    }
  }

  async register(email: string, password: string): Promise<void> {
    await this.start(await this.api.request<SessionView>('/auth/register', { method: 'POST', body: { email, password } }));
  }

  async login(email: string, password: string): Promise<void> {
    await this.start(await this.api.request<SessionView>('/auth/login', { method: 'POST', body: { email, password } }));
  }

  async logout(): Promise<void> {
    const refreshToken = await this.store.getRefresh();
    this.clear();
    await this.store.setRefresh(null);
    if (refreshToken) await this.api.request('/auth/logout', { method: 'POST', body: { refreshToken } }).catch(() => undefined);
  }

  /** Petición con sesión: renueva el token si ha caducado y reintenta una vez si la API responde 401. */
  async authed<T>(path: string, opts: Parameters<Api['request']>[1] = {}): Promise<T> {
    if (!this.accessToken || Date.now() > this.accessExpiresAt - 30_000) await this.refresh();
    try {
      return await this.api.request<T>(path, { ...opts, token: this.accessToken });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && (await this.refresh())) {
        return this.api.request<T>(path, { ...opts, token: this.accessToken });
      }
      throw e;
    }
  }

  /** Vuelve a leer el usuario y su solicitud (después de guardar el test o de enviar/cancelar). */
  async reload(): Promise<void> {
    if (!this.user()) return;
    const [user, request] = await Promise.all([
      this.authed<UserView>('/auth/me'),
      this.authed<CurrentRequest>('/requests/current'),
    ]);
    this.user.set(user);
    this.request.set(request);
  }

  private async start(s: SessionView): Promise<void> {
    this.accessToken = s.accessToken;
    this.accessExpiresAt = Date.now() + s.expiresIn * 1000;
    await this.store.setRefresh(s.refreshToken);
    this.user.set(s.user);
    this.request.set(await this.api.request<CurrentRequest>('/requests/current', { token: s.accessToken }).catch(() => null));
  }

  private refresh(): Promise<boolean> {
    this.refreshing ??= (async () => {
      const refreshToken = await this.store.getRefresh();
      if (!refreshToken) return (this.clear(), false);
      try {
        await this.start(await this.api.request<SessionView>('/auth/refresh', { method: 'POST', body: { refreshToken } }));
        return true;
      } catch (e) {
        // Token caducado o revocado: se cierra la sesión. Sin conexión: se mantiene para reintentar luego.
        if (e instanceof ApiError && e.status === 401) {
          this.clear();
          await this.store.setRefresh(null);
        }
        return false;
      } finally {
        this.refreshing = null;
      }
    })();
    return this.refreshing;
  }

  private clear(): void {
    this.accessToken = null;
    this.accessExpiresAt = 0;
    this.user.set(null);
    this.request.set(null);
  }
}
