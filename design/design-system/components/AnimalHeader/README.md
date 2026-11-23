# AnimalHeader
Abre la ficha de la mascota. La foto es la protagonista (es lo que hace que una persona se enamore de una mascota) y los datos clave se leen de un vistazo, en lugar de una línea larga separada por « · ».

## Anatomía
1. **Foto** (`pp-animal-hero`): 280 px de alto a ancho completo, esquinas `corner-extra-large` (28). Mientras no hay imagen, hueco en `tertiary-container` (arena) con el icono `image` de 48 y «Foto de la mascota» en `on-tertiary-container` (7,97:1), igual que en la tarjeta de mascota y el carrusel.
2. **Píldora de compatibilidad** sobre la foto, abajo a la izquierda: «92 %» en `primary` (negrita) + «compatible» en `on-surface`, sobre `surface-container-lowest` y `corner-full`. Solo con el test hecho.
3. **Nombre** en `display-small-emphasized` (Fraunces 36/44 · 600).
4. **Ubicación** con el icono `location_on` de 20 px, en `body-large` y `on-surface-variant`.
5. Etiqueta «Necesidades especiales» (`Tag`) si corresponde.
6. **Datos clave** (`FactTiles`): especie, sexo, edad y tamaño.

## Accesibilidad
La foto y la píldora son decorativas (`aria-hidden`): el porcentaje se anuncia en `TestResults`, justo debajo. El nombre es el encabezado de la ficha.

## Tokens
`tertiary-container`, `on-tertiary-container`, `surface-container-lowest`, `primary`, `on-surface`, `on-surface-variant`, `corner-extra-large`, `corner-full`.

## Fuente
Wireframe de fidelidad media: Ficha de la mascota.
