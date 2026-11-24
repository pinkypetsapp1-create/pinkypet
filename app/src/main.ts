import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { Session } from './app/core/session';
import { applySystemTextZoom } from './app/core/text-zoom';
import { Theme } from './app/core/theme';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Ionic solo como estructura: modo «md» sin animaciones propias de Ionic entre pantallas.
    provideIonicAngular({ mode: 'md', animated: false }),
    provideRouter(routes, withComponentInputBinding()),
    // Antes de pintar: tema del sistema y sesión guardada (para que los guards conozcan el estado).
    provideAppInitializer(() => {
      inject(Theme).init();
      void applySystemTextZoom();
      // Mitigación del arranque en frío de Render: despierta el backend mientras se ve el Inicio (sin esperar la respuesta).
      void fetch(new URL('/health', environment.apiUrl)).catch(() => undefined);
      // Recupera la sesión guardada, pero sin dejar la pantalla en blanco más de 8 s si el backend está despertando:
      // la renovación sigue en segundo plano y la interfaz se actualiza sola al terminar.
      return Promise.race([inject(Session).restore(), new Promise<void>((r) => setTimeout(r, 8_000))]);
    }),
  ],
});
