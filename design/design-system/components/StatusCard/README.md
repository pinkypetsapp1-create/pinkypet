# StatusCard
Tarjeta outlined que abre la pantalla «Estado de la solicitud».

## Anatomía
- Fila superior: «Estado» en `title-small` y, a la derecha, el `Tag` de estado.
- Debajo, el nombre de la mascota en `title-large-emphasized` (Fraunces).
- Después de la tarjeta: un titular de resultado opcional (`TextPatterns`), el mensaje en `body-large`, el `Stepper` y las acciones.

## Mensajes del wireframe
| Estado | Titular | Mensaje |
|---|---|---|
| En proceso | — | Has enviado tu solicitud de adopción. Ahora toca esperar una respuesta. |
| Adopción finalizada | ¡La protectora ha aceptado tu solicitud! | Se pondrá en contacto contigo para preparar la llegada de {nombre} a casa. |
| No disponible | Esta mascota ya no está disponible | Lo sentimos: {nombre} ya no está disponible para adopción… |
| Cancelada | Has cancelado tu solicitud | {nombre} sigue disponible por si cambias de idea… |

## Tokens
`surface-container-lowest`, `outline-variant`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Estado de la solicitud (todas las fases).
