import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** AccountPrompt del Design System: «¿Aún no tienes cuenta? Regístrate» y/o «¿Ya tienes cuenta? Inicia sesión». */
@Component({
  selector: 'pp-account-prompts',
  imports: [RouterLink],
  host: { class: 'pp-account-prompts' },
  template: `
    @if (registro()) {
      <p class="pp-prompt">{{ registroPregunta() }}
        <a class="pp-btn pp-btn--text pp-btn--lead pp-state" routerLink="/registro"><span class="pp-icon pp-icon--20" aria-hidden="true">person_add</span>Regístrate</a>
      </p>
    }
    @if (login()) {
      <p class="pp-prompt">{{ loginPregunta() }}
        <a class="pp-btn pp-btn--text pp-btn--lead pp-state" routerLink="/login"><span class="pp-icon pp-icon--20" aria-hidden="true">login</span>Inicia sesión</a>
      </p>
    }
  `,
  // Si la frase no cabe (206 px o letra grande), el botón pasa debajo en vez de salirse (design-feedback F3-4).
  styles: [':host { display: flex; flex-direction: column; align-items: center; } .pp-prompt { flex-wrap: wrap; text-align: center; }'],
})
export class AccountPrompts {
  readonly registro = input(true);
  readonly login = input(true);
  readonly registroPregunta = input('¿Aún no tienes cuenta?');
  readonly loginPregunta = input('¿Ya tienes cuenta?');
}
