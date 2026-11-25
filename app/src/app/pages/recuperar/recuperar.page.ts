import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Api, ApiError } from '../../core/api';
import { EMAIL_PATTERN, TEXTOS } from '../../core/error-text';
import { AccountPrompts } from '../../ui/account-prompts';
import { Banner } from '../../ui/banner';
import { EmptyState } from '../../ui/empty-state';
import { TextField } from '../../ui/text-field';
import { TopAppBar } from '../../ui/top-app-bar';
import { networkText } from '../network-text';

/** Recuperar.dc.html y Recuperar-Enviado.dc.html. */
@Component({
  selector: 'pp-recuperar',
  imports: [IonContent, RouterLink, TopAppBar, TextField, Banner, EmptyState, AccountPrompts],
  templateUrl: './recuperar.page.html',
  styleUrl: '../auth.css',
})
export class RecuperarPage {
  private readonly api = inject(Api);
  protected readonly scrolled = signal(false);
  protected readonly email = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '');
  protected readonly emailError = signal<string | null>(null);
  protected readonly banner = signal<string | null>(null);
  protected readonly sending = signal(false);
  protected readonly enviado = signal(false);

  async submit(): Promise<void> {
    if (this.sending()) return;
    const email = this.email().trim();
    this.emailError.set(EMAIL_PATTERN.test(email) ? null : TEXTOS.emailFormato);
    this.banner.set(null);
    if (this.emailError()) return;
    this.sending.set(true);
    try {
      await this.api.request('/auth/password/forgot', { method: 'POST', body: { email } });
      this.enviado.set(true);
    } catch (e) {
      if (e instanceof ApiError && e.code === 'VALIDATION_FAILED') this.emailError.set(TEXTOS.emailFormato);
      // Demasiados intentos: ya se ha enviado un enlace hace poco; se muestra lo mismo (no revela si la cuenta existe).
      else if (e instanceof ApiError && e.status === 429) this.enviado.set(true);
      else this.banner.set(networkText(e));
    } finally {
      this.sending.set(false);
    }
  }
}
