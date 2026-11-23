import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import type { ApiErrorBody } from './api.types';

export class ApiError extends Error {
  constructor(readonly status: number, readonly body: ApiErrorBody) {
    super(body.message);
  }
  get code(): string {
    return this.body.code;
  }
  get fields(): Record<string, string[]> {
    return this.body.fields ?? {};
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | boolean | undefined>;
}

/** Cliente HTTP mínimo. Convierte cualquier fallo en ApiError con un código que la app sabe traducir. */
@Injectable({ providedIn: 'root' })
export class Api {
  async request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const url = new URL(path, environment.apiUrl);
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: opts.method ?? 'GET',
        headers,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: AbortSignal.timeout(environment.apiTimeoutMs),
      });
    } catch (e) {
      const timeout = e instanceof DOMException && e.name === 'TimeoutError';
      throw new ApiError(0, { code: timeout ? 'TIMEOUT' : 'NETWORK', message: String(e) });
    }
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status, (data as ApiErrorBody) ?? { code: 'INTERNAL_ERROR', message: res.statusText });
    return data as T;
  }
}
