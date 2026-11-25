/**
 * Datos del arranque de la app (se evalúa al cargarla, desde main.ts, antes de que el router cambie la URL).
 * La animación del logotipo sale al abrir la app en Inicio, una sola vez por arranque (SplashPrimerInicio, DS 1795600951-f0b0).
 */
const rutaInicial = typeof location === 'undefined' ? '' : location.pathname.replace(/\/+$/, '');
let animacionPendiente = rutaInicial === '' || rutaInicial === '/inicio';

/** true solo la primera vez que se pregunta en este arranque, y solo si la app se abrió en Inicio. */
export function tomarAnimacionDeEntrada(): boolean {
  const toca = animacionPendiente;
  animacionPendiente = false;
  return toca;
}
