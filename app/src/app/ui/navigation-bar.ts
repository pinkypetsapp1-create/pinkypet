import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export type Tab = 'inicio' | 'mascotas' | 'proceso' | 'perfil';

const TABS: { k: Tab; label: string; icon: string; path: string }[] = [
  { k: 'inicio', label: 'Inicio', icon: 'home', path: '/inicio' },
  { k: 'mascotas', label: 'Mascotas', icon: 'search', path: '/mascotas' },
  { k: 'proceso', label: 'Proceso', icon: 'hourglass_empty', path: '/proceso' },
  { k: 'perfil', label: 'Mi perfil', icon: 'person', path: '/perfil' },
];

/** NavigationBar del Design System (design/alta-fidelidad/TabBar.dc.html). Cada ruta decide qué mostrar según el estado. */
@Component({
  selector: 'pp-navigation-bar',
  imports: [RouterLink],
  host: { style: 'display: contents' },
  template: `
    <nav class="pp-navbar" [class.pp-navbar--label-activa]="narrow()" aria-label="Navegación principal">
      @for (t of tabs; track t.k; let i = $index) {
        <a class="pp-navbar__item" [routerLink]="t.path"
           [attr.aria-current]="t.k === active() ? 'page' : 'false'"
           [attr.aria-label]="t.label + ', pestaña ' + (i + 1) + ' de 4' + (t.k === active() ? ', seleccionada' : '')">
          <span class="pp-navbar__ind pp-state"><span class="pp-icon" aria-hidden="true">{{ t.icon }}</span></span>
          <span>{{ t.label }}</span>
        </a>
      }
    </nav>
  `,
})
export class NavigationBar {
  readonly active = input.required<Tab>();
  protected readonly tabs = TABS;
  /**
   * Reflujo (zoom al 200 %, 206 px): las 4 etiquetas no caben. Se aplica la regla ACC1 del Design System
   * (pp-navbar--label-activa: solo la etiqueta de la pestaña activa). docs/design-feedback.md F2-2.
   */
  protected readonly narrow = signal(false);
  constructor() {
    const mq = window.matchMedia('(max-width: 320px)');
    const set = () => this.narrow.set(mq.matches);
    set();
    mq.addEventListener('change', set);
    inject(DestroyRef).onDestroy(() => mq.removeEventListener('change', set));
  }
}
