import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { Session } from './app/core/session';
import { Theme } from './app/core/theme';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Ionic solo como estructura: modo «md» sin animaciones propias de Ionic entre pantallas.
    provideIonicAngular({ mode: 'md', animated: false }),
    provideRouter(routes, withComponentInputBinding()),
    // Antes de pintar: tema del sistema y sesión guardada (para que los guards conozcan el estado).
    provideAppInitializer(() => {
      inject(Theme).init();
      return inject(Session).restore();
    }),
  ],
});
