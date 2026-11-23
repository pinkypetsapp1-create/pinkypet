import { ApiError } from '../core/api';

/**
 * Texto para un fallo sin código de pantalla propio (sin conexión o error inesperado).
 * PENDIENTE DE DECISIÓN (docs/design-feedback.md F2-1): el diseño no tiene texto de «sin conexión» en Registro,
 * Login ni Test. Mientras tanto se reutiliza el texto literal de Error-Catalogo.
 */
export function networkText(_e: unknown): string {
  void (_e instanceof ApiError);
  return 'Parece que no hay conexión a internet. Comprueba tu wifi o tus datos móviles e inténtalo de nuevo.';
}
