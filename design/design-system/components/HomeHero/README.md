# HomeHero
Tarjeta rellena que abre Inicio. Es la pieza protagonista: tus ilustraciones grandes sobre formas Expressive y un titular a escala display.

## Anatomía
- **Escenario de 112 px:** el gato a 56 px sobre una forma cookie-9 de 112 y, a su derecha, el perro a 44 px sobre una soft-burst de 80, centrada en vertical respecto al gato. Las dos formas, en `surface-container-lowest`, quedan **separadas 12 px**, nunca se solapan. Son decorativas.
- **Titular** en `display-small-emphasized` (Fraunces 36/44 · 600).
- **Texto** en `body-medium`.
- **Botón** relleno M a ancho completo.

Fondo `primary-container` (rosa pálido, solo en tarjetas destacadas) con títulos y texto en `on-primary-container` (7,19:1); el botón, `primary` / `on-primary`. Esquinas `corner-medium` (las mismas que ProcessHero).

## Variantes
| Situación | Titular | Texto | Acción |
|---|---|---|---|
| Invitado / registrado sin test | ¿Qué mascota encaja contigo? | El test de compatibilidad valora qué mascota encaja con tu hogar, tu día a día y lo que buscas en una mascota, antes de que decidas adoptar. | Descubrir mi compatibilidad (→ Registro o Test) |
| Test hecho | {n} mascotas encajan contigo | Ya tienes tus resultados. Mira por qué encaja cada uno contigo y elige con calma. | Ver mis mascotas compatibles |
| Solicitud en proceso | Tu solicitud para adoptar a {nombre} está en proceso | La protectora la está revisando. Te avisaremos cuando responda. | Ver el estado de mi solicitud |

## Tokens
`primary-container`, `on-primary-container`, `surface-container-lowest`, `primary`, `on-primary`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Inicio (invitado, registrado, con test).
