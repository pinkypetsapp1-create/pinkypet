import { Component, input } from '@angular/core';

/** CompatibilityMeter del Design System: «92 % compatible», barra Expressive y texto corto. */
@Component({
  selector: 'pp-compatibility-meter',
  host: { class: 'pp-meter' },
  template: `
    <p class="pp-meter__value"><span class="pp-meter__pct">{{ pct() }} %</span><span class="pp-meter__unit">compatible</span></p>
    <div class="pp-progress" aria-hidden="true">
      <span class="pp-progress__active" [style.--pp-value]="'calc(' + pct() + '% - 2px)'"></span>
      <span class="pp-progress__track"></span>
      <span class="pp-progress__stop"></span>
    </div>
    @if (caption()) { <p class="pp-meter__caption">{{ caption() }}</p> }
  `,
})
export class CompatibilityMeter {
  readonly pct = input.required<number>();
  readonly caption = input<string | null>(null);
}
