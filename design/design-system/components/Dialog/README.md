# Dialog
Diálogo básico de M3, de 312 px, sobre un velo al 32 %.

## Variantes del wireframe
| Diálogo | Rol | Icono | Acciones (texto, apiladas a la derecha) |
|---|---|---|---|
| ¿Enviar tu solicitud para adoptar a {nombre}? | `dialog` | — | Sí, enviar solicitud · Cancelar |
| ¿Cancelar tu solicitud anterior? (límite de una solicitud) | `alertdialog` | — | Salir y mantener la anterior · Continuar y cancelar la anterior |
| No se ha podido enviar tu solicitud | `alertdialog` | `error` | Reintentar el envío · Volver a la ficha |
| Solicitud enviada | `dialog` | `check_circle` | Ver el estado del proceso |
| ¿Seguro que quieres cancelar tu solicitud para adoptar a {nombre}? | `alertdialog` | — | No, mantener mi solicitud · Sí, cancelar solicitud |
| No se ha podido cancelar tu solicitud | `alertdialog` | `error` | Reintentar la cancelación · Mantener mi solicitud |

## Anatomía
- Icono opcional de 24 px en `secondary`, centrado; con icono, el título también va centrado.
- Título en `headline-small` y cuerpo en `body-medium` con `on-surface-variant`.
- Fondo `surface-container-high` y esquinas `corner-extra-large`, sin sombra.

## Reglas
Las acciones nombran lo que hacen; nunca «Aceptar». Tocar el velo equivale a la acción que no cambia nada.

## Accesibilidad
`aria-modal="true"`, `aria-labelledby` al título y `aria-describedby` al cuerpo. El velo es un `<button>` con `aria-label`.

## Tokens
`surface-container-high`, `on-surface`, `on-surface-variant`, `secondary`, `scrim`, `scrim-opacity`, `corner-extra-large`.

## Fuente
Wireframe de fidelidad media: Ficha (confirmar envío, límite, error de envío), Estado (enviada, cancelar, error al cancelar).
