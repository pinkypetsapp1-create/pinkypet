# BottomActionBar
Zona fija entre el contenido y la barra de navegación que mantiene a mano la acción principal. Sin borde superior: se separa por tono (`surface-container`, el mismo de la barra de navegación), de modo que acciones y navegación forman una sola zona inferior, como pide Expressive (color antes que líneas o sombras).

## Variantes
- **Ficha** (`pp-action-bar`, relleno 16): «Enviar solicitud de adopción», o «Ver el estado de mi solicitud» si ya se ha enviado, más «Seguir mirando otras mascotas» en outlined.
- **Test** (`pp-action-bar pp-action-bar--test`, relleno 12/16/16): resumen de error (`Banner`) si faltan respuestas, el contador «12 de 15 respondidas · Responde todas para ver tus mascotas compatibles.» (`aria-live="polite"`) y «Ver mis mascotas compatibles».

## Tokens
`surface-container`, `on-surface-variant`, `space-3`, `space-4`.

## Fuente
Wireframe de fidelidad media: Ficha de la mascota, Test.
