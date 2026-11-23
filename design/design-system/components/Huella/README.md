# Huella
La huella «p» de la marca **sin círculo** (el mismo dibujo que el isotipo y que `huella-p.svg`), como elemento gráfico. No es un icono: no lleva acción ni texto alternativo.

## Uso
- `<span class="pp-paw">` con el SVG dentro (`viewBox 0 0 100 100`), 40 × 40 por defecto.
- Color con `color` (el SVG usa `fill: currentColor`): por defecto `primary`. **Nunca** se deja el relleno por defecto del SVG, que sale negro.
- Dedos hacia arriba; se puede girar unos grados (±6° en la animación de primer inicio).
- Decorativa: `aria-hidden="true"` y `focusable="false"`.

## Reglas
- Mismo dibujo siempre: no se crean huellas nuevas ni se redibuja (una sola huella de marca).
- Tamaño mínimo 24 px (como la huella «p» del Logo).
- No se usa como indicador de carga en fila ni como icono de navegación (la navegación usa Material Symbols).
- No va sobre `secondary-container` (regla COL3).

## Tokens
`primary` (con opacidad cuando es decorativa: 0,5 en Claro, 0,7 en Oscuro en el primer inicio).

## Fuente
Wireframe de fidelidad media: no estaba en el wireframe; se añade en alta fidelidad (animación de primer inicio).
