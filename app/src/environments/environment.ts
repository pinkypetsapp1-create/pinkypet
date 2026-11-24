export const environment = {
  production: false,
  /** API local: `cd backend && npm run dev:mem` (puerto 3000). */
  apiUrl: 'http://localhost:3000',
  /** Tiempo máximo de espera de una petición. */
  apiTimeoutMs: 15_000,
  /**
   * ID de cliente web de Google (OAuth). No es secreto. Vacío = no se muestra «Continuar con Google».
   * Cómo obtenerlo: docs/DEPLOY.md, «Google».
   */
  googleWebClientId: '13489786586-c3qlu0936qfd7jk4egf0l8bslvdqi26n.apps.googleusercontent.com',
};
