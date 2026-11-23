import { Injectable } from '@angular/core';

/** Tema claro u oscuro según el sistema. Se aplica con data-theme, el selector que usan tokens.css y bundle.css. */
@Injectable({ providedIn: 'root' })
export class Theme {
  init(): void {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
  }
}
