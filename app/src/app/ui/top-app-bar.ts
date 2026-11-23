import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * TopAppBar del Design System (components/TopAppBar).
 * - `brand`: sello + «Pinky Pet» (pantallas con pestañas).
 * - `back`: flecha «Volver» + título de la pantalla.
 * El tono pasa a surface-container al hacer scroll (`scrolled`).
 */
@Component({
  selector: 'pp-top-app-bar',
  imports: [RouterLink],
  host: { style: 'display: contents' },
  template: `
    @if (variant() === 'brand') {
      <header class="pp-topbar pp-topbar--brand" [class.pp-topbar--scrolled]="scrolled()">
        <span class="pp-topbar__mark" aria-hidden="true"></span>
        <span class="pp-topbar__title">Pinky Pet</span>
      </header>
    } @else {
      <header class="pp-topbar" [class.pp-topbar--scrolled]="scrolled()">
        <a class="pp-icon-btn pp-state" [routerLink]="back()" aria-label="Volver">
          <span class="pp-icon" aria-hidden="true">arrow_back</span>
        </a>
        @if (headingTitle()) {
          <h1 class="pp-topbar__title">{{ title() }}</h1>
        } @else {
          <span class="pp-topbar__title">{{ title() }}</span>
        }
      </header>
    }
  `,
})
export class TopAppBar {
  readonly variant = input<'brand' | 'back'>('brand');
  readonly title = input('');
  readonly back = input<string>('/inicio');
  /** true si el título de la barra es el encabezado principal de la pantalla (Test). */
  readonly headingTitle = input(false);
  readonly scrolled = input(false);
}
