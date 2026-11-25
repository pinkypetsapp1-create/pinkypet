import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Api, ApiError } from '../../core/api';
import { TEXTOS } from '../../core/error-text';
import { Session } from '../../core/session';
import { Banner } from '../../ui/banner';
import { EmptyState } from '../../ui/empty-state';
import { TextField } from '../../ui/text-field';
import { TopAppBar } from '../../ui/top-app-bar';
import { networkText } from '../network-text';

type Estado = 'formulario' | 'hecha' | 'caducado';

/** NuevaContrasena.dc.html con sus estados «hecha» y «caducado». Se llega desde el enlace del correo. */
@Component({
  selector: 'pp-nueva-contrasena',
  imports: [IonContent, RouterLink, TopAppBar, TextField, Banner, EmptyState],
  templateUrl: './nueva-contrasena.page.html',
  styleUrl: '../auth.css',
})
export class NuevaContrasenaPage implements OnInit {
  private readonly api = inject(Api);
  private readonly session = inject(Session);
  private readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';
  protected readonly scrolled = signal(false);
  protected readonly estado = signal<Estado>(this.token ? 'formulario' : 'caducado');
  protected readonly password = signal('');
  protected readonly password2 = signal('');
  protected readonly passError = signal<string | null>(null);
  protected readonly pass2Error = signal<string | null>(null);
  protected readonly summary = signal<string | null>(null);
  protected readonly sending = signal(false);

  async ngOnInit(): Promise<void> {
    if (!this.token) return;
    // Se comprueba el enlace al abrirlo para no hacer escribir dos contraseñas en vano. Si falla la red, se sigue: lo dirá al guardar.
    try {
      await this.api.request('/auth/password/reset', { query: { token: this.token } });
    } catch (e) {
      if (e instanceof ApiError && e.code === 'RESET_TOKEN_INVALID') this.estado.set('caducado');
    }
  }

  async submit(): Promise<void> {
    if (this.sending()) return;
    const pass = this.password();
    const passErr = TEXTOS.passError(pass);
    const pass2Err = TEXTOS.pass2Error(pass, this.password2());
    this.passError.set(passErr);
    this.pass2Error.set(pass2Err);
    const n = [passErr, pass2Err].filter(Boolean).length;
    this.summary.set(n ? TEXTOS.resumenNuevaContrasena(n) : null);
    if (n) return;

    this.sending.set(true);
    try {
      await this.api.request('/auth/password/reset', { method: 'POST', body: { token: this.token, password: pass } });
      // El backend ha cerrado todas las sesiones; también la de este dispositivo, si había una.
      if (this.session.state() !== 'invitado') await this.session.logout().catch(() => undefined);
      this.estado.set('hecha');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'RESET_TOKEN_INVALID') this.estado.set('caducado');
      else if (e instanceof ApiError && e.code === 'VALIDATION_FAILED') {
        this.passError.set(TEXTOS.passError(''));
        this.summary.set(TEXTOS.resumenNuevaContrasena(1));
      } else this.summary.set(networkText(e));
    } finally {
      this.sending.set(false);
    }
  }
}
