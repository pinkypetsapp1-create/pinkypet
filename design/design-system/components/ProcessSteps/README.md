# ProcessSteps
Los cuatro pasos para adoptar en la pantalla «Cómo adoptar», marcando dónde está el usuario.

## Anatomía
Cada paso tiene una **forma Expressive propia** de 48 px (cookie-4, soft-burst, cookie-9, sunny), con el número en peso enfatizado (22/28 · 600) o un `check` si está hecho. A la derecha va el título en `body-large` y una línea de explicación en `body-medium`. Un conector discontinuo de 2 px en `outline` une los pasos.

## Estados
| Estado | Forma | Título |
|---|---|---|
| Completado (`pp-pstep--done`) | `on-surface` con `check` | `on-surface`, 700 |
| Actual (`pp-pstep--current`, `aria-current="step"`) | `primary` con número en `on-primary` | `on-surface`, 700 |
| Pendiente | `secondary-container` con número en `secondary` (5,20:1) | `on-surface-variant`, 400 |

## Lógica
- **Sin test** (invitado o registrado): paso 1 actual.
- **Test hecho, sin solicitud**: paso 1 hecho y paso 2 actual.
- **Solicitud en proceso**: pasos 1 a 3 hechos y paso 4 actual.

## Textos
1. Haz el test de compatibilidad. · 15 preguntas sobre tu hogar, tu día a día y lo que buscas en una mascota.
2. Revisa las mascotas compatibles y su ficha. · Verás por qué encaja cada uno contigo y qué necesita para estar bien.
3. Envía una solicitud de adopción. · Solo puedes tener una solicitud en proceso a la vez.
4. Espera una respuesta. · La protectora revisa tu solicitud y te responde. Puedes seguir el estado en todo momento.

## Accesibilidad
`<ol aria-label="Pasos para adoptar">`. Cada `<li>` lleva un `aria-label` como «Paso 2 de 4, Revisa las mascotas compatibles y su ficha, paso actual», y el contenido visual va con `aria-hidden`.

## Tokens
`secondary-container`, `secondary`, `primary`, `on-primary`, `on-surface`, `on-surface-variant`, `outline`.

## Fuente
Wireframe de fidelidad media: Cómo adoptar (todas las variantes).
