import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { Api } from '../../core/api';
import type { AnswersView, TestView } from '../../core/api.types';
import { Session } from '../../core/session';
import { AccountPrompts } from '../../ui/account-prompts';
import { NavigationBar } from '../../ui/navigation-bar';
import { TopAppBar } from '../../ui/top-app-bar';

/** Mi perfil: vacío (sin cuenta), registrado sin test y completado con las respuestas (PerfilVacio / PerfilCompletado). */
@Component({
  selector: 'pp-perfil',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar, AccountPrompts],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.css',
})
export class PerfilPage implements ViewWillEnter {
  private readonly api = inject(Api);
  protected readonly session = inject(Session);
  protected readonly scrolled = signal(false);
  private readonly test = signal<TestView | null>(null);
  private readonly answers = signal<Record<string, string> | null>(null);

  protected readonly conTest = computed(() => ['completo', 'solicitud'].includes(this.session.state()));
  protected readonly bloquesVacios = ['Mi hogar', 'Mi día a día', 'La mascota que busco'];
  protected readonly respuestas = computed(() => {
    const t = this.test();
    const a = this.answers();
    if (!t || !a) return [];
    return t.bloques.map((b) => ({ titulo: b.titulo, items: t.preguntas.filter((q) => q.bloque === b.id).map((q) => ({ q: q.resumen, a: a[q.id] })) }));
  });

  async ionViewWillEnter(): Promise<void> {
    if (!this.conTest()) return;
    const [t, a] = await Promise.all([this.api.request<TestView>('/test/questions'), this.session.authed<AnswersView>('/test/answers')]);
    this.test.set(t);
    this.answers.set(a.answers ?? null);
  }
}
