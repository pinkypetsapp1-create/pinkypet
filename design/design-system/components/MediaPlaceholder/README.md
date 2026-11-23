# MediaPlaceholder
Hueco reservado para la foto de la mascota mientras el wireframe no tiene imágenes reales.

## Variantes
- **Tarjeta** (`pp-media` dentro de `pp-animal-card`): 128 px de alto y a sangre (sin margen lateral ni superior), con las esquinas superiores de la tarjeta, icono `image` de 32 + «Foto de la mascota» en `body-small`. Dentro de `AnimalCard` va en `tertiary-container` / `on-tertiary-container`.
- **Ficha:** ahora forma parte de `AnimalHeader` (`pp-animal-hero`, 280 px, `corner-extra-large`, arena).

## Con foto real
Un `<img>` dentro se recorta con `object-fit: cover`. El `alt` describe a la mascota; el placeholder es decorativo (`aria-hidden`).

## Tokens
`surface-container-highest`, `on-surface-variant`, `tertiary-container`, `on-tertiary-container`, `corner-small`.

## Fuente
Wireframe de fidelidad media: Mascotas, Compatibles.
