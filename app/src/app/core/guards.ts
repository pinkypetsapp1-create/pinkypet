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
