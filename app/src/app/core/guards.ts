import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Session } from './session';

/** Registro e Iniciar sesión solo tienen sentido sin cuenta. */
export const soloInvitado: CanActivateFn = () => {
  const s = inject(Session);
  return s.state() === 'invitado' ? true : inject(Router).parseUrl('/inicio');
};

/** El test exige cuenta: sin ella, «Descubrir mi compatibilidad» lleva a Registro (CONEXIONES de Main). */
export const conCuenta: CanActivateFn = () => {
  const s = inject(Session);
  return s.state() !== 'invitado' ? true : inject(Router).parseUrl('/registro');
};

/** La ficha muestra la compatibilidad: sin cuenta → Registro; sin test → Test (CONEXIONES de Mascotas). */
export const conTest: CanActivateFn = () => {
  const s = inject(Session);
  const r = inject(Router);
  if (s.state() === 'invitado') return r.parseUrl('/registro');
  if (s.state() === 'registrado') return r.parseUrl('/test');
  return true;
};
