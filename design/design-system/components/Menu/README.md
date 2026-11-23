# Menu
Menú desplegable de selección única con las 52 provincias, que abre el chip «Ubicación».

## Anatomía
204 px de ancho, 288 de alto como máximo (con scroll) y 8 px de relleno vertical, sobre `surface-container` con `elevation-2` y esquinas `corner-extra-small` (4, como en el wireframe). Opciones de 48 px en `body-large` con un hueco de 24 px para el icono `check`, que solo aparece en la opción marcada; esa opción además se rellena con `secondary-container` y su texto e icono pasan a `on-secondary-container`. Pulsar la opción marcada la desmarca.

## Accesibilidad
`role="menu"` con `menuitemradio` y `aria-checked`.

## Tokens
`surface-container`, `secondary-container`, `on-surface`, `on-surface-variant`, `elevation-2`, `corner-extra-small`.

## Fuente
Wireframe de fidelidad media: Mascotas (filtro de ubicación).
