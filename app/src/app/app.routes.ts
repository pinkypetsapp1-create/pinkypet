import type { Routes } from '@angular/router';
import { conCuenta, soloInvitado } from './core/guards';

// Rutas de docs/design-map.md. Las pestañas de 2b y 2c usan de momento PendientePage.
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage) },
  { path: 'registro', canActivate: [soloInvitado], loadComponent: () => import('./pages/registro/registro.page').then((m) => m.RegistroPage) },
  { path: 'login', canActivate: [soloInvitado], loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage) },
  { path: 'test', canActivate: [conCuenta], loadComponent: () => import('./pages/test/test.page').then((m) => m.TestPage) },
  { path: 'mascotas', data: { tab: 'mascotas' }, loadComponent: () => import('./pages/pendiente/pendiente.page').then((m) => m.PendientePage) },
  { path: 'proceso', data: { tab: 'proceso' }, loadComponent: () => import('./pages/pendiente/pendiente.page').then((m) => m.PendientePage) },
  { path: 'perfil', data: { tab: 'perfil' }, loadComponent: () => import('./pages/pendiente/pendiente.page').then((m) => m.PendientePage) },
  { path: '**', redirectTo: 'inicio' },
];
