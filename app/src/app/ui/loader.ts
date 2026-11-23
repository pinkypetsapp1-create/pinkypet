import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LOADER_SVG } from './shapes';

/** Indicador de carga M3 Expressive del botón (pp-btn--loading). Toma el color del texto del botón. */
@Component({
  selector: 'pp-loader',
  host: { class: 'pp-btn__loader', '[innerHTML]': 'svg' },
  template: '',
})
export class Loader {
  protected readonly svg = this.sanitizer.bypassSecurityTrustHtml(LOADER_SVG);
  constructor(private readonly sanitizer: DomSanitizer) {}
}
