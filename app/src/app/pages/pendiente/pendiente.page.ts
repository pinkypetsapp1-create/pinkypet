import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { NavigationBar, Tab } from '../../ui/navigation-bar';
import { TopAppBar } from '../../ui/top-app-bar';

/**
 * Hueco para las pestañas que llegan en las entregas 2b (Mascotas) y 2c (Proceso, Mi perfil).
 * Solo la barra superior y las pestañas, para poder navegar; no se inventa contenido.
 */
@Component({
  selector: 'pp-pendiente',
  imports: [IonContent, TopAppBar, NavigationBar],
  template: `
    <div class="pp-page">
      <pp-top-app-bar variant="brand" />
      <ion-content><main class="pp-page__main"></main></ion-content>
      <pp-navigation-bar [active]="tab" />
    </div>
  `,
})
export class PendientePage {
  protected readonly tab = inject(ActivatedRoute).snapshot.data['tab'] as Tab;
}
