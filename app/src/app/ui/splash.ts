import { Component, ElementRef, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HUELLA_SVG } from './shapes';

const VISTO = 'pp.primerInicio';

/**
 * SplashPrimerInicio del Design System (components/SplashPrimerInicio): huellas → sello → el sello vuela al de la
 * barra superior. Solo la primera vez que se abre la app; con movimiento reducido no se muestra. 1,55 s.
 * Las posiciones del DS son para 412 × 917; aquí se calculan a partir del tamaño real de la pantalla.
 */
@Component({
  selector: 'pp-splash',
  template: `
    @if (visible()) {
      <div class="pp-splash pp-splash--run" aria-hidden="true" [style]="vars()" (animationend)="fin($event)">
        <div class="pp-splash__scrim"></div>
        @for (p of huellas(); track p.i) {
          <span class="pp-paw pp-splash__print" [style]="p.style" [innerHTML]="huella"></span>
        }
        <span class="pp-mark pp-splash__seal"></span>
      </div>
    }
  `,
  styles: [':host { position: absolute; inset: 0; z-index: 40; pointer-events: none; } :host:has(.pp-splash) { pointer-events: auto; }'],
})
export class Splash implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  protected readonly huella = inject(DomSanitizer).bypassSecurityTrustHtml(HUELLA_SVG);
  protected readonly visible = signal(false);
  protected readonly vars = signal('');
  protected readonly huellas = signal<{ i: number; style: string }[]>([]);

  ngOnInit(): void {
    let visto = true;
    try {
      visto = localStorage.getItem(VISTO) === '1';
      localStorage.setItem(VISTO, '1');
    } catch {
      /* sin almacenamiento: no se muestra para no repetirla en cada arranque */
    }
    if (visto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { width: w, height: h } = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    // Proporciones del DS a 412 × 917: sello de 58 % del ancho centrado en (w/2, 445/917·h); vuela al sello de la barra (32, 32).
    const seal = Math.round(w * 0.58);
    const cx = w / 2;
    const cy = (h * 445) / 917;
    this.vars.set(`--pp-seal-size:${seal}px;--pp-seal-x:${cx}px;--pp-seal-y:${cy}px;--pp-dx:${32 - cx}px;--pp-dy:${32 - cy}px;--pp-scale:${32 / seal}`);
    this.huellas.set([858, 780, 702, 624].map((y, i) => ({
      i,
      style: `--i:${i};--x:${cx + (i % 2 ? 23 : -23)}px;--y:${(h * y) / 917}px;--r:${i % 2 ? 6 : -6}deg`,
    })));
    this.visible.set(true);
  }

  protected fin(e: AnimationEvent): void {
    if (e.animationName === 'pp-splash-end') this.visible.set(false);
  }
}
