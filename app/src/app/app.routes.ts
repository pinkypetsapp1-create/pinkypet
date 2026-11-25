import type { Routes } from '@angular/router';
import { conCuenta, conTest, soloInvitado } from './core/guards';

// Rutas de docs/design-map.md.
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage) },
  { path: 'registro', canActivate: [soloInvitado], loadComponent: () => import('./pages/registro/registro.page').then((m) => m.RegistroPage) },
  { path: 'login', canActivate: [soloInvitado], loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage) },
  { path: 'recuperar', canActivate: [soloInvitado], loadComponent: () => import('./pages/recuperar/recuperar.page').then((m) => m.RecuperarPage) },
  // Sin guarda: el enlace del correo puede abrirse con una sesión iniciada (al guardar, se cierra).
  { path: 'nueva-contrasena', loadComponent: () => import('./pages/nueva-contrasena/nueva-contrasena.page').then((m) => m.NuevaContrasenaPage) },
  { path: 'test', canActivate: [conCuenta], loadComponent: () => import('./pages/test/test.page').then((m) => m.TestPage) },
  { path: 'mascotas', loadComponent: () => import('./pages/mascotas/mascotas.page').then((m) => m.MascotasPage) },
  { path: 'mascotas/:id', canActivate: [conTest], loadComponent: () => import('./pages/ficha/ficha.page').then((m) => m.FichaPage) },
  { path: 'proceso', loadComponent: () => import('./pages/proceso/proceso.page').then((m) => m.ProcesoPage) },
  { path: 'proceso/solicitud', loadComponent: () => import('./pages/solicitud/solicitud.page').then((m) => m.SolicitudPage) },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage) },
  { path: '**', redirectTo: 'inicio' },
];
