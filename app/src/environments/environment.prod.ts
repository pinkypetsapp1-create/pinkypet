export const environment = {
  production: true,
  /** Backend publicado en Render (render.yaml: servicio «pinky-pet-api»). Si Render asigna otra URL, cámbiala aquí. */
  apiUrl: 'https://pinky-pet-api.onrender.com',
  /** Render gratuito se duerme tras 15 min y tarda ~1 min en despertar: se espera hasta 75 s (decisión F3, mitigación). */
  apiTimeoutMs: 75_000,
  /** ID de cliente web de Google (OAuth). No es secreto. Vacío = no se muestra «Continuar con Google». */
  googleWebClientId: '13489786586-c3qlu0936qfd7jk4egf0l8bslvdqi26n.apps.googleusercontent.com',
};
