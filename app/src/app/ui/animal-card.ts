import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PetSummary } from '../core/api.types';
import { CompatibilityMeter } from './compatibility-meter';

/** AnimalCard del Design System (components/AnimalCard). */
@Component({
  selector: 'pp-animal-card',
  imports: [RouterLink, CompatibilityMeter],
  template: `
    <article class="pp-animal-card" [attr.aria-label]="pet().nombre">
      <div class="pp-media"><img [src]="'assets/' + pet().foto.asset" [alt]="pet().foto.alt" /></div>
      @if (pet().necesidadesEspeciales) { <span class="pp-tag">Necesidades especiales</span> }
      <h2 class="pp-animal-card__name">{{ pet().nombre }}</h2>
      <p class="pp-animal-card__meta">{{ pet().sexo }} · {{ pet().edad }}</p>
      <p class="pp-animal-card__meta pp-animal-card__meta--muted">{{ pet().ciudad }} · {{ pet().tamano }}</p>
      @if (pet().compatibilidad; as c) {
        <pp-compatibility-meter [pct]="c.porcentaje" [caption]="pet().motivoCorto" />
      }
      <span class="pp-animal-card__spacer" aria-hidden="true"></span>
      <div class="pp-animal-card__footer">
        <a class="pp-target" [routerLink]="link()" [attr.aria-label]="aria()">
          <span class="pp-btn pp-btn--tonal pp-btn--s pp-state animal-card__btn">{{ label() }}</span>
        </a>
      </div>
    </article>
  `,
  styles: [':host { display: block; } .animal-card__btn { flex: 1; }'],
})
export class AnimalCard {
  readonly pet = input.required<PetSummary>();
  readonly link = input.required<string>();
  readonly label = input.required<string>();
  readonly aria = input.required<string>();
}
