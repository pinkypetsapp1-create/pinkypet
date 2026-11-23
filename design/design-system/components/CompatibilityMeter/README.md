# CompatibilityMeter
Porcentaje de compatibilidad con la barra de progreso lineal de M3 Expressive.

## Anatomía
- Cifra en `numeric-large-emphasized` (Roboto 22/28 · 600) con `primary` (malva), seguida siempre de «compatible» en `label-large-emphasized`. El color no cambia con el valor: ni rojo, ni ámbar, ni verde, ni degradados.
- Barra de 8 px: tramo activo en `primary`, **hueco de 4 px**, pista en `surface-container-highest` y **punto de parada** de 4 px al final.
- Motivo corto o caption en `body-small`.

## Uso
- **Tarjeta de mascota** (con test): motivo corto, por ejemplo «Encaja con tu rutina», «Necesita juego diario», «Necesita mucho espacio», «Necesita paseos cortos», «Encaja con tu espacio» o «Necesita cuidado dental».
- **Ficha**: dentro de `TestResults`, con «Según tus respuestas en los 3 bloques del test.».

## Implementación
Pon `style="--pp-value: calc(92% - 2px)"` en `pp-progress__active`. La barra es decorativa (`aria-hidden`), porque el valor ya está en el texto.

## Tokens
`primary`, `surface-container-highest`, `on-surface-variant`, `corner-full`.

## Fuente
Wireframe de fidelidad media: Compatibles, Ficha.
