import { AfterViewInit, Component, ElementRef, HostListener, input, output } from '@angular/core';

let next = 0;

/**
 * Dialog del Design System (components/Dialog): velo + caja centrada.
 * Escape o tocar el velo = la acción de cerrar. Al abrir, el foco va a la primera acción.
 */
@Component({
  selector: 'pp-dialog',
  host: { class: 'pp-dialog-layer' },
  template: `
    <button type="button" class="pp-scrim" [attr.aria-label]="scrimLabel()" (click)="closed.emit()"></button>
    <div class="pp-dialog" [attr.role]="alert() ? 'alertdialog' : 'dialog'" aria-modal="true"
         [attr.aria-labelledby]="id + '-t'" [attr.aria-describedby]="id + '-d'">
      @if (icon()) { <span class="pp-icon pp-dialog__icon" aria-hidden="true">{{ icon() }}</span> }
      <h2 class="pp-dialog__title" [id]="id + '-t'">{{ title() }}</h2>
      <p class="pp-dialog__body" [id]="id + '-d'">{{ body() }}</p>
      <div class="pp-dialog__actions"><ng-content /></div>
    </div>
  `,
  styles: [`
    /* Si no cabe (zoom al 200 % o texto grande), el diálogo se desplaza en vez de cortarse. */
    :host { position: absolute; inset: 0; z-index: 30; display: flex; align-items: safe center; justify-content: center; overflow-y: auto; }
    .pp-scrim { position: fixed; }
    .pp-dialog { position: relative; margin: var(--space-6) 0; }
  `],
})
export class Dialog implements AfterViewInit {
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly icon = input<string | null>(null);
  readonly alert = input(false);
  readonly scrimLabel = input('Cerrar');
  readonly closed = output<void>();
  protected readonly id = `pp-dialog-${++next}`;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.querySelector<HTMLElement>('.pp-dialog__actions button, .pp-dialog__actions a')?.focus();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closed.emit();
  }
}
