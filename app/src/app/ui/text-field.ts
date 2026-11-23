import { Component, computed, input, model } from '@angular/core';

let next = 0;

/** TextField outlined del Design System (components/TextField). Muestra el error debajo, enlazado con aria-describedby. */
@Component({
  selector: 'pp-text-field',
  host: { class: 'pp-field', '[class.pp-field--error]': 'isInvalid()' },
  template: `
    <div class="pp-field__box">
      <input class="pp-field__input" [id]="id" [type]="type()" [attr.autocomplete]="autocomplete()"
             [value]="value()" (input)="value.set($any($event.target).value)"
             [attr.aria-invalid]="isInvalid() ? 'true' : 'false'"
             [attr.aria-describedby]="describedBy() ?? (error() || support() ? id + '-msg' : null)" />
      <label class="pp-field__label" [for]="id">{{ label() }}</label>
      @if (isInvalid()) { <span class="pp-icon pp-icon--filled pp-field__trailing" aria-hidden="true">error</span> }
    </div>
    @if (error()) {
      <p class="pp-field__support" [id]="id + '-msg'">{{ error() }}</p>
    } @else if (support()) {
      <p class="pp-field__support" [id]="id + '-msg'">{{ support() }}</p>
    }
    <ng-content />
  `,
})
export class TextField {
  readonly label = input.required<string>();
  readonly type = input<'email' | 'password' | 'text'>('text');
  readonly autocomplete = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly support = input<string | null>(null);
  /** Marca el campo como no válido aunque el mensaje esté fuera (aviso «Ya existe una cuenta con este correo»). */
  readonly invalid = input(false);
  readonly describedBy = input<string | null>(null);
  readonly value = model('');
  protected readonly isInvalid = computed(() => !!this.error() || this.invalid());
  protected readonly id = `pp-field-${++next}`;
}
