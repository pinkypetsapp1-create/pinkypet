# FilterChip
Chip de 32 px, con área táctil de 48, para filtrar la lista de mascotas.

## Variantes
- **Conmutable** «Necesidades especiales»: `<button aria-pressed>` con `pp-chip` dentro. Seleccionado muestra `check` de 18 px.
- **Con menú** «Ubicación»: `pp-chip pp-chip--menu` con `arrow_drop_down`. Abre el `Menu` de provincias; con una elegida, muestra `check` y el nombre de la provincia. Lleva `aria-haspopup="menu"`, `aria-expanded` y `aria-label` «Ubicación: Barcelona».

## Estados
- Sin seleccionar: borde `outline-variant` y texto `on-surface-variant`.
- Seleccionado: `secondary-container` con texto e icono `on-secondary-container` (7,21:1), check visible y **morph de forma Expressive** de `corner-small` (8) a `corner-medium` (12).

## Tokens
`secondary-container`, `outline-variant`, `on-surface-variant`, `on-surface`, `corner-small`, `label-large`.

## Fuente
Wireframe de fidelidad media: Mascotas y Compatibles.
