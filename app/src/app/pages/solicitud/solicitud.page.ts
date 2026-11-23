import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import type { RequestView } from '../../core/api.types';
import { Session } from '../../core/session';
import { Dialog } from '../../ui/dialog';
import { EmptyState } from '../../ui/empty-state';
import { NavigationBar } from '../../ui/navigation-bar';
import { TopAppBar } from '../../ui/top-app-bar';

type Dialogo = 'aviso' | 'cancelar' | 'error-cancelar' | null;
interface Paso { label: string; note?: string; st: 'done' | 'current' | 'pending' | 'stopped'; num?: number; icon?: string }

/**
 * Estado de la solicitud (Estado.dc.html): en proceso (con o sin el aviso «Solicitud enviada»), finalizada,
 * no disponible y cancelada; Error-Cancelar. Sin solicitud: SinSolicitud.dc.html.
 * Qué se muestra: la solicitud en proceso; si no hay, la última si la protectora respondió; si no, «sin solicitud».
 * La cancelada se ve solo justo después de cancelar (docs/SPEC.md §10).
 */
@Component({
  selector: 'pp-solicitud',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar, Dialog, EmptyState],
  templateUrl: './solicitud.page.html',
  styleUrl: './solicitud.page.css',
})
export class SolicitudPage implements OnInit, ViewWillEnter {
  protected readonly session = inject(Session);
  private readonly route = inject(ActivatedRoute);
  protected readonly scrolled = signal(false);
  protected readonly dialogo = signal<Dialogo>(null);
  protected readonly cancelada = signal<RequestView | null>(null);
  protected readonly cancelando = signal(false);

  protected readonly solicitud = computed<RequestView | null>(() => {
    if (this.cancelada()) return this.cancelada();
    const r = this.session.request();
    if (r?.activa) return r.activa;
    return r?.ultima && ['finalizada', 'rechazada'].includes(r.ultima.estado) ? r.ultima : null;
  });
  protected readonly nombre = computed(() => this.solicitud()?.mascota.nombre ?? '');

  protected readonly vista = computed(() => {
    const s = this.solicitud();
    if (!s) return null;
    const n = s.mascota.nombre;
    const done = (label: string, note?: string): Paso => ({ label, note, st: 'done', icon: 'check' });
    switch (s.estado) {
      case 'finalizada':
        return { tag: 'Adopción finalizada', tagDone: true, titulo: '¡La protectora ha aceptado tu solicitud!', texto: `Se pondrá en contacto contigo para preparar la llegada de ${n} a casa.`, pasos: [done('Solicitud enviada'), done('Respuesta recibida'), done('Adopción finalizada')] };
      case 'rechazada':
        return { tag: 'No disponible', tagDone: false, titulo: 'Esta mascota ya no está disponible', texto: `Lo sentimos: ${n} ya no está disponible para adopción. Puedes volver a tus mascotas compatibles y elegir otro.`, pasos: [done('Solicitud enviada'), done('Respuesta recibida'), { label: 'No disponible', st: 'stopped', icon: 'close' } as Paso] };
      case 'cancelada':
        return { tag: 'Cancelada', tagDone: false, titulo: 'Has cancelado tu solicitud', texto: `${n} sigue disponible por si cambias de idea. Puedes volver a tus mascotas compatibles cuando quieras.`, pasos: [done('Solicitud enviada'), { label: 'Solicitud cancelada', st: 'stopped', icon: 'close' } as Paso] };
      default:
        return { tag: 'En proceso', tagDone: false, titulo: '', texto: 'Has enviado tu solicitud de adopción. Ahora toca esperar una respuesta.', pasos: [done('Solicitud enviada', '(completado)'), { label: 'Esperando respuesta', st: 'current', num: 2 } as Paso, { label: 'Adopción finalizada', st: 'pending', num: 3 } as Paso] };
    }
  });
  protected readonly volverCompat = computed(() => ['rechazada', 'cancelada'].includes(this.solicitud()?.estado ?? ''));

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('aviso')) this.dialogo.set('aviso');
  }

  async ionViewWillEnter(): Promise<void> {
    this.cancelada.set(null);
    await this.session.reload().catch(() => undefined);
  }

  protected aria(p: Paso, i: number, total: number): string {
    const st = { done: 'completado', current: 'paso actual', pending: 'pendiente', stopped: 'no disponible' }[p.st];
    return `Paso ${i + 1} de ${total}, ${p.label}, ${st}`;
  }

  protected async cancelar(): Promise<void> {
    const s = this.solicitud();
    if (!s) return;
    this.dialogo.set(null);
    this.cancelando.set(true);
    try {
      const r = await this.session.authed<RequestView>(`/requests/${s.id}/cancel`, { method: 'POST' });
      await this.session.reload();
      this.cancelada.set(r);
    } catch {
      this.dialogo.set('error-cancelar');
    } finally {
      this.cancelando.set(false);
    }
  }
}
