import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { Api, ApiError } from '../../core/api';
import type { AnswersView, Question, TestView } from '../../core/api.types';
import { TEXTOS } from '../../core/error-text';
import { Session } from '../../core/session';
import { Banner } from '../../ui/banner';
import { NavigationBar } from '../../ui/navigation-bar';
import { SHAPE_TIP_48 } from '../../ui/shapes';
import { TopAppBar } from '../../ui/top-app-bar';
import { networkText } from '../network-text';

/**
 * Test de compatibilidad (Test.dc.html), Test-Error y Test-Completado.
 * Cada vez que se entra empieza vacío; con el test ya hecho, viene con las respuestas guardadas.
 */
@Component({
  selector: 'pp-test',
  imports: [IonContent, TopAppBar, NavigationBar, Banner],
  templateUrl: './test.page.html',
  styleUrl: './test.page.css',
})
export class TestPage implements ViewWillEnter {
  private readonly api = inject(Api);
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  protected readonly scrolled = signal(false);
  protected readonly test = signal<TestView | null>(null);
  protected readonly answers = signal<Record<string, string>>({});
  protected readonly showErrors = signal(false);
  protected readonly sending = signal(false);
  protected readonly sendError = signal<string | null>(null);
  protected readonly tipShape = SHAPE_TIP_48;
  protected readonly preguntaSinResponder = TEXTOS.preguntaSinResponder;

  protected readonly bloques = computed(() => {
    const t = this.test();
    if (!t) return [];
    return t.bloques.map((b) => ({
      titulo: b.titulo,
      meta: `5 preguntas · ${Math.round(b.peso * 100)} % del test`,
      preguntas: t.preguntas.filter((q) => q.bloque === b.id),
    }));
  });
  protected readonly missing = computed(() => (this.test()?.preguntas ?? []).filter((q) => !this.answers()[q.id]).map((q) => q.numero));
  protected readonly complete = computed(() => !!this.test() && this.missing().length === 0);
  protected readonly missingText = computed(() => {
    const m = this.missing();
    if (m.length === 1) return `Te falta 1 pregunta por responder: la ${m[0]}.`;
    const lista = m.slice(0, -1).join(', ') + ' y ' + m[m.length - 1];
    return `Te faltan ${m.length} preguntas por responder: ${lista}.`;
  });

  async ionViewWillEnter(): Promise<void> {
    this.showErrors.set(false);
    this.sendError.set(null);
    this.test.set(await this.api.request<TestView>('/test/questions'));
    if (this.session.user()?.hasTest) {
      const saved = await this.session.authed<AnswersView>('/test/answers');
      this.answers.set({ ...(saved.answers ?? {}) });
    } else {
      this.answers.set({});
    }
  }

  protected pick(q: Question, opcion: string): void {
    this.answers.update((a) => ({ ...a, [q.id]: opcion }));
  }

  protected hasError(q: Question): boolean {
    return this.showErrors() && !this.answers()[q.id];
  }

  async submit(): Promise<void> {
    if (!this.complete()) {
      this.showErrors.set(true);
      return;
    }
    if (this.sending()) return;
    this.sending.set(true);
    this.sendError.set(null);
    try {
      await this.session.authed('/test/answers', { method: 'PUT', body: { answers: this.answers() } });
      await this.session.reload();
      await this.router.navigateByUrl('/mascotas');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'VALIDATION_FAILED') this.showErrors.set(true);
      else this.sendError.set(networkText(e));
    } finally {
      this.sending.set(false);
    }
  }
}
