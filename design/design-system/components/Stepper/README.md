# Stepper
Pasos verticales del estado de una solicitud de adopción.

## Estados de paso
| Estado | Clase | Marcador |
|---|---|---|
| Completado | `pp-step--done` | círculo `on-surface` con `check` |
| Actual | `pp-step--current` | borde de 2 px en `primary` con el número en `primary`; lleva `aria-current="step"` |
| Pendiente | (base) | borde de 1 px en `outline`, con número y texto en `on-surface-variant` |
| Detenido | `pp-step--stopped` | borde de 2 px en `on-surface` con `close` |

Entre pasos hay un conector discontinuo de 2 px en `outline`. La nota «(completado)» va en `body-small`.

## Flujos del wireframe
- **En proceso**: Solicitud enviada → Esperando respuesta → Adopción finalizada.
- **Finalizada**: los 3 pasos completados.
- **Rechazada**: … → No disponible (detenido).
- **Cancelada**: Solicitud enviada → Solicitud cancelada (detenido).

## Accesibilidad
`<ol aria-label="Pasos de la solicitud">`. Cada `<li>` lleva un `aria-label` como «Paso 2 de 3, Esperando respuesta, paso actual».

## Fuente
Wireframe de fidelidad media: Estado de la solicitud (en proceso, finalizada, no disponible, cancelada).
