# SelectableCard
Tarjeta conmutable con ilustración para filtrar la lista de mascotas por tipo. Es una outlined card *checkable* de M3: la pieza entera se puede pulsar.

## Anatomía
Círculo de 72 px con la ilustración (44 px) o, en «Otros», el isotipo de la marca (40 px), etiqueta en `label-large` y `check_circle` relleno arriba a la derecha cuando está seleccionada. Rejilla de 3 columnas con 8 px de hueco y 124 px de alto.

## Ilustraciones y marca
«Gatos» y «Perros» usan las ilustraciones del grupo de assets **Ilustraciones** (`gato.png`, `perro.png`). «Otros» usa el **isotipo de la marca** (`pp-mark`, el sello con la «p»-huella, dibujado con CSS) a 40 px: cubre conejos, aves, roedores y demás sin elegir una mascota concreto. El sello va siempre dentro del círculo claro (`surface-container-low` o, seleccionada, `surface-container-lowest`) y nunca directamente sobre el verde: así se cumple la COL3. Seguirá la paleta si el tema cambia.

## Estados
- **Sin seleccionar**: `surface-container-lowest` con borde `outline-variant`; círculo en `surface-container-low` (#F7F3F1). Antes iba en `surface-container-highest`, pero ese gris restaba contraste a las ilustraciones (ILU2).
- **Seleccionada** (`aria-pressed="true"`): `secondary-container` con etiqueta y check `check_circle` en `on-secondary-container` (7,21:1; el malva nunca va sobre el verde), círculo en `surface-container-lowest` y **morph de forma Expressive**: las esquinas pasan de `corner-medium` (12) a `corner-large-increased` (20) con el spring espacial rápido. La selección se lee por tono y por forma, no solo por el gris.

## Accesibilidad
`<button aria-pressed>` dentro de `role="group" aria-label="Tipo de mascota"`. Ilustración y check son decorativos.

## Tokens
`secondary-container`, `on-secondary-container`, `surface-container-lowest`, `surface-container-low`, `outline-variant`, `corner-medium`, `corner-large-increased`.

## Fuente
Wireframe de fidelidad media: Mascotas y Compatibles (filtros).
