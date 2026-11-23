import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { ApiError } from '../../core/api';
import type { PetDetail } from '../../core/api.types';
import { Session } from '../../core/session';
import { CompatibilityMeter } from '../../ui/compatibility-meter';
import { Dialog } from '../../ui/dialog';
import { Loader } from '../../ui/loader';
import { NavigationBar } from '../../ui/navigation-bar';
import { SHAPE_INSIGHT_40 } from '../../ui/shapes';
import { TopAppBar } from '../../ui/top-app-bar';

type Dialogo = 'confirmar' | 'limite' | 'error-envio' | null;

/**
 * Ficha de la mascota (Ficha.dc.html): sin enviar, enviada (Ficha-<Mascota>-Enviada), con otra solicitud en
 * proceso (Ficha-Limite), enviando (indicador de carga) y Error-Envio.
 */
@Component({
  selector: 'pp-ficha',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar, CompatibilityMeter, Dialog, Loader],
  templateUrl: './ficha.page.html',
  styleUrl: './ficha.page.css',
})
export class FichaPage implements ViewWillEnter {
  readonly id = input.required<string>();
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  protected readonly scrolled = signal(false);
  protected readonly pet = signal<PetDetail | null>(null);
  protected readonly dialogo = signal<Dialogo>(null);
  protected readonly enviando = signal(false);
  protected readonly insightShape = SHAPE_INSIGHT_40;

  protected readonly activa = computed(() => this.session.request()?.activa ?? null);
  /** Esta mascota ya tiene la solicitud de la persona (en proceso o adopción finalizada): no se puede volver a enviar. */
  protected readonly enviada = computed(() => {
    const u = this.session.request()?.ultima;
    return this.activa()?.mascota.id === this.id() || (u?.estado === 'finalizada' && u.mascota.id === this.id());
  });
  protected readonly volver = computed(() => (this.enviada() ? '/proceso/solicitud' : '/mascotas'));

  protected readonly facts = computed(() => {
    const p = this.pet();
    return p ? [['Especie', p.especie], ['Sexo', p.sexo], ['Edad', p.edad], ['Tamaño', p.tamano]] : [];
  });
  protected readonly bloques = computed(() => {
    const b = this.pet()?.compatibilidad?.bloques;
    return b ? [['Mi hogar', b.hogar], ['Mi día a día', b.diaADia], ['La mascota que busco', b.mascota]] as const : [];
  });
  protected readonly salud = computed(() => {
    const i = this.pet()?.info;
    return i ? [['Estado de salud', i.estadoSalud], ['Vacunación', i.vacunacion], ['Cuidados que necesita', i.cuidados], ['Necesidades especiales', i.necesidadesEspeciales]] : [];
  });
  protected readonly caracter = computed(() => {
    const i = this.pet()?.info;
    return i ? [['Su comportamiento', i.comportamiento], ['Su nivel de actividad', i.nivelActividad], ['Convivencia con mascotas', i.convivenciaMascotas], ['Su historia', i.historia]] : [];
  });

  async ionViewWillEnter(): Promise<void> {
    this.dialogo.set(null);
    this.pet.set(await this.session.authed<PetDetail>(`/pets/${this.id()}`));
  }

  protected pedir(): void {
    if (this.enviada()) return;
    this.dialogo.set(this.activa() ? 'limite' : 'confirmar');
  }

  /** «Sí, enviar solicitud», «Reintentar el envío» o «Continuar y cancelar la anterior» (replaceActive). */
  protected async enviar(replaceActive = false): Promise<void> {
    this.dialogo.set(null);
    this.enviando.set(true);
    try {
      await this.session.authed('/requests', { method: 'POST', body: { petId: this.id(), replaceActive } });
      await this.session.reload();
      await this.router.navigate(['/proceso/solicitud'], { queryParams: { aviso: 1 } });
    } catch (e) {
      if (e instanceof ApiError && e.code === 'ACTIVE_REQUEST_EXISTS') {
        await this.session.reload();
        this.dialogo.set('limite');
      } else {
        this.dialogo.set('error-envio');
      }
    } finally {
      this.enviando.set(false);
    }
  }
}
