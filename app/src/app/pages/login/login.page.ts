import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiError } from '../../core/api';
import { EMAIL_PATTERN, TEXTOS } from '../../core/error-text';
import { Session } from '../../core/session';
import { AccountPrompts } from '../../ui/account-prompts';
import { Banner } from '../../ui/banner';
import { TextField } from '../../ui/text-field';
import { TopAppBar } from '../../ui/top-app-bar';
import { networkText } from '../network-text';

/** Iniciar sesión y Error-Login. «Continuar con Google» oculto (SPEC §10). */
@Component({
  selector: 'pp-login',
  imports: [IonContent, TopAppBar, TextField, Banner, AccountPrompts],
  templateUrl: './login.page.html',
  styleUrl: '../auth.css',
})
export class LoginPage implements OnInit {
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly scrolled = signal(false);
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly emailError = signal<string | null>(null);
  protected readonly passError = signal<string | null>(null);
  /** Banner superior: resumen de campos, credenciales incorrectas o sin conexión. Sustituye a la entradilla. */
  protected readonly banner = signal<string | null>(null);
  protected readonly wrongCredentials = signal(false);
  protected readonly sending = signal(false);
  protected readonly reescribe = TEXTOS.loginReescribe;

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) this.email.set(email);
  }

  async submit(): Promise<void> {
    if (this.sending()) return;
    const email = this.email().trim();
    const pass = this.password();
    const emailErr = EMAIL_PATTERN.test(email) ? null : TEXTOS.emailFormato;
    const passErr = pass ? null : TEXTOS.passVacia;
    this.emailError.set(emailErr);
    this.passError.set(passErr);
    const n = (emailErr ? 1 : 0) + (passErr ? 1 : 0);
    this.wrongCredentials.set(false);
    this.banner.set(n ? TEXTOS.resumenLogin(n) : null);
    if (n) return;

    this.sending.set(true);
    try {
      await this.session.login(email, pass);
      await this.router.navigateByUrl('/inicio');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'AUTH_INVALID_CREDENTIALS') {
        this.wrongCredentials.set(true);
        this.password.set('');
        this.banner.set(TEXTOS.loginIncorrecto);
      } else {
        this.banner.set(networkText(e));
      }
    } finally {
      this.sending.set(false);
    }
  }
}
