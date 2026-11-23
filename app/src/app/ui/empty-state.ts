import { Component, computed, input } from '@angular/core';
import { SHAPE_EMPTY_96, SHAPE_EMPTY_96_BY_ICON } from './shapes';

/** EmptyState del Design System: forma Expressive con icono, título y texto. La acción va proyectada. */
@Component({
  selector: 'pp-empty-state',
  host: { class: 'pp-empty' },
  template: `
    <span class="pp-shape pp-shape--96" aria-hidden="true">
      <svg width="96" height="96" viewBox="0 0 96 96" focusable="false" style="position: absolute; inset: 0"><path class="pp-shape__fill" [attr.d]="shape()" /></svg>
      <span class="pp-icon pp-icon--48">{{ icon() }}</span>
    </span>
    <h2 class="pp-empty__title">{{ title() }}</h2>
    @for (t of texts(); track t) { <p class="pp-empty__body">{{ t }}</p> }
    <ng-content />
  `,
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly texts = input<string[]>([]);
  /** Cada pantalla del diseño usa su propia forma Expressive; por defecto, la del vacío de Mascotas. */
  protected readonly shape = computed(() => SHAPE_EMPTY_96_BY_ICON[this.icon()] ?? SHAPE_EMPTY_96);
}
