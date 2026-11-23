import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiError } from '../../core/api';
import { EMAIL_PATTERN, TEXTOS } from '../../core/error-text';
import { Session } from '../../core/session';
import { AccountPrompts } from '../../ui/account-prompts';
import { Banner } from '../../ui/banner';
import { TextField } from '../../ui/text-field';
import { TopAppBar } from '../../ui/top-app-bar';
import { networkText } from '../network-text';

/** Registro, Error-Registro-Campos y Error-Registro-Existe. «Continuar con Google» oculto (SPEC §10). */
@Component({
  selector: 'pp-registro',
  imports: [IonContent, TopAppBar, TextField, Banner, AccountPrompts],
  templateUrl: './registro.page.html',
  styleUrl: '../auth.css',
})
export class RegistroPage {
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  protected readonly scrolled = signal(false);
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly emailError = signal<string | null>(null);
  protected readonly passError = signal<string | null>(null);
  protected readonly summary = signal<string | null>(null);
  protected readonly emailTaken = signal(false);
  protected readonly sending = signal(false);

  async submit(): Promise<void> {
    if (this.sending()) return;
    this.emailTaken.set(false);
    const email = this.email().trim();
    const pass = this.password();
    const emailErr = EMAIL_PATTERN.test(email) ? null : TEXTOS.emailFormato;
    const passErr = pass.length >= 8 ? null : pass.length === 0 ? TEXTOS.passMin : TEXTOS.passMinAhora(pass.length);
    this.showFieldErrors(emailErr, passErr);
    if (emailErr || passErr) return;

    this.sending.set(true);
    try {
      await this.session.register(email, pass);
      await this.router.navigateByUrl('/test');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'EMAIL_ALREADY_REGISTERED') {
        this.emailTaken.set(true);
      } else if (e instanceof ApiError && e.code === 'VALIDATION_FAILED') {
        this.showFieldErrors(e.fields['email'] ? TEXTOS.emailFormato : null, e.fields['password'] ? TEXTOS.passMinAhora(pass.length) : null);
      } else {
        this.summary.set(networkText(e));
      }
    } finally {
      this.sending.set(false);
    }
  }

  protected loginConEsteCorreo(): void {
    void this.router.navigate(['/login'], { queryParams: { email: this.email().trim() } });
  }

  private showFieldErrors(emailErr: string | null, passErr: string | null): void {
    this.emailError.set(emailErr);
    this.passError.set(passErr);
    const n = (emailErr ? 1 : 0) + (passErr ? 1 : 0);
    this.summary.set(n ? TEXTOS.resumenRegistro(n) : null);
  }

  protected readonly correoExiste = TEXTOS.correoExiste;
}
