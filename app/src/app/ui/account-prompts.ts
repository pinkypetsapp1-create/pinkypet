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
      <p class="pp-prompt">¿Ya tienes cuenta?
        <a class="pp-btn pp-btn--text pp-btn--lead pp-state" routerLink="/login"><span class="pp-icon pp-icon--20" aria-hidden="true">login</span>Inicia sesión</a>
      </p>
    }
  `,
  styles: [':host { display: flex; flex-direction: column; align-items: center; }'],
})
export class AccountPrompts {
  readonly registro = input(true);
  readonly login = input(true);
  readonly registroPregunta = input('¿Aún no tienes cuenta?');
}
