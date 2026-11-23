import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { Api } from '../../core/api';
import type { CompatibilityList, PetList, PetSummary } from '../../core/api.types';
import { PROVINCIAS } from '../../core/provincias';
import { Session } from '../../core/session';
import { AnimalCard } from '../../ui/animal-card';
import { EmptyState } from '../../ui/empty-state';
import { NavigationBar } from '../../ui/navigation-bar';
import { TopAppBar } from '../../ui/top-app-bar';

type Tipo = 'gato' | 'perro' | 'otros';
type Estado = 'cargando' | 'ok' | 'sin-conexion';

/**
 * Mascotas (Catalogo.dc.html) en sus estados: sin cuenta, registrado, Compatibles (con test) y con solicitud;
 * vacío con filtros, Error-Catalogo (sin conexión) y Error-SinCompatibles.
 */
@Component({
  selector: 'pp-mascotas',
  imports: [IonContent, RouterLink, TopAppBar, NavigationBar, AnimalCard, EmptyState],
  templateUrl: './mascotas.page.html',
  styleUrl: './mascotas.page.css',
})
export class MascotasPage implements ViewWillEnter {
  private readonly api = inject(Api);
  protected readonly session = inject(Session);
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly scrolled = signal(false);
  protected readonly provincias = PROVINCIAS;

  protected readonly tipos = signal<Record<Tipo, boolean>>({ gato: false, perro: false, otros: false });
  protected readonly ne = signal(false);
  protected readonly provincia = signal('');
  protected readonly menu = signal(false);
  protected readonly estado = signal<Estado>('cargando');
  protected readonly pets = signal<PetSummary[]>([]);
  protected readonly sinCompatibles = signal(false);

  protected readonly conTest = computed(() => ['completo', 'solicitud'].includes(this.session.state()));
  protected readonly testLink = computed(() => (this.session.state() === 'invitado' ? '/registro' : '/test'));
  protected readonly tiposDef: { k: Tipo; label: string; img: string | null }[] = [
    { k: 'gato', label: 'Gatos', img: 'assets/ilustraciones/gato.png' },
    { k: 'perro', label: 'Perros', img: 'assets/ilustraciones/perro.png' },
    { k: 'otros', label: 'Otros', img: null },
  ];
  protected readonly activos = computed(() => {
    const t = this.tipos();
    const a = this.tiposDef.filter((d) => t[d.k]).map((d) => d.label);
    if (this.ne()) a.push('Necesidades especiales');
    if (this.provincia()) a.push(this.provincia());
    return a;
  });
  protected readonly contador = computed(() => (this.pets().length === 1 ? '1 mascota' : `${this.pets().length} mascotas`));
  protected readonly vacioTexto = computed(() =>
    this.provincia() && this.provincia() !== 'Barcelona'
      ? `Ahora mismo no hay mascotas en adopción en ${this.provincia()}. Prueba con otra provincia o quita los filtros.`
      : 'Prueba a cambiar o quitar algún filtro.',
  );

  ionViewWillEnter(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.estado.set('cargando');
    const query = {
      tipo: (Object.keys(this.tipos()) as Tipo[]).filter((k) => this.tipos()[k]).join(','),
      ne: this.ne() ? true : undefined,
      provincia: this.provincia() || undefined,
    };
    try {
      if (this.conTest()) {
        const r = await this.session.authed<CompatibilityList>('/compatibility', { query });
        this.pets.set(r.items);
        this.sinCompatibles.set(r.sinCompatibles && this.activos().length === 0);
      } else {
        this.pets.set((await this.api.request<PetList>('/pets', { query })).items);
        this.sinCompatibles.set(false);
      }
      this.estado.set('ok');
    } catch {
      this.estado.set('sin-conexion');
    }
  }

  protected toggleTipo(k: Tipo): void {
    this.tipos.update((t) => ({ ...t, [k]: !t[k] }));
    void this.load();
  }
  protected toggleNe(): void {
    this.ne.update((v) => !v);
    void this.load();
  }
  protected pickProvincia(p: string): void {
    this.provincia.update((v) => (v === p ? '' : p));
    this.menu.set(false);
    void this.load();
  }
  protected clear(): void {
    this.tipos.set({ gato: false, perro: false, otros: false });
    this.ne.set(false);
    this.provincia.set('');
    this.menu.set(false);
    void this.load();
  }

  protected cardLink(p: PetSummary): string {
    return this.conTest() ? `/mascotas/${p.id}` : this.testLink();
  }
  protected cardLabel(): string {
    return this.conTest() ? 'Más información' : 'Ver compatibilidad';
  }
  protected cardAria(p: PetSummary): string {
    return this.conTest() ? `Más información sobre ${p.nombre}` : `Ver compatibilidad: hacer el test para ver la ficha de ${p.nombre}`;
  }

  @HostListener('document:keydown.escape') protected closeMenu(): void {
    this.menu.set(false);
  }
  @HostListener('document:click', ['$event']) protected outside(e: MouseEvent): void {
    if (this.menu() && !(this.host.nativeElement.querySelector('.mascotas-ubicacion') as HTMLElement | null)?.contains(e.target as Node)) this.menu.set(false);
  }
}
