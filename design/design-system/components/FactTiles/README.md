# FactTiles
Rejilla de 4 casillas con los datos que más pesan al decidir: especie, sexo, edad y tamaño.

## Anatomía
Casillas rellenas en `tertiary-container` (arena) con `corner-large` (16), 72 px de alto como mínimo y 8 px de hueco. Valor en `title-medium` y, debajo, la etiqueta en `body-small`, ambos en `on-tertiary-container` (7,97:1). Prueba UX14: sobre una foto real, la arena hace de pausa entre la foto y el nombre.

## Accesibilidad
`<dl>`: en el código va primero el `dt` (etiqueta) y luego el `dd` (valor), aunque visualmente el valor se ve arriba (`column-reverse`). Así un lector de pantalla dice «Edad, 3 años».

## Tokens
`tertiary-container`, `on-tertiary-container`, `corner-large`.

## Fuente
Wireframe de fidelidad media: Ficha de la mascota.
