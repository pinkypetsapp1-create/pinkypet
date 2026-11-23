# Question
Pregunta del test de compatibilidad: un `<fieldset>` con radios dentro de una tarjeta outlined.

## Anatomía
Leyenda en `title-medium` y opciones `pp-radio` de 56 px como mínimo (radio de 20 px en `primary` + texto en `body-large`). Cada bloque de 5 preguntas va precedido por su encabezado (`TextPatterns` → encabezado de bloque). Tras algunas preguntas aparece un `ExpertTip` («Consejo del experto»).

## Estados
- **Normal**: borde `outline-variant`.
- **Sin responder al pulsar «Ver mis mascotas compatibles»** (`aria-invalid="true"`): borde de 2 px en `error` y el mensaje «Responde esta pregunta para continuar.» con el icono `error` relleno. El resumen va en un `Banner` dentro de la barra inferior.

## Tokens
`surface-container-lowest`, `outline-variant`, `error`, `primary`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Test, Test con preguntas sin responder.
