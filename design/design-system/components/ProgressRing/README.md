# ProgressRing
Indicador circular determinado de M3 Expressive para el peso de cada bloque del test en Inicio. Cada anillo va en su propia tarjeta y **mantiene el porcentaje** (decisión U1).

## Anatomía (tarjeta `pp-ring-tile`)
- **Tarjeta:** outlined (`surface-container-lowest` + `outline-variant`, `corner-medium`), en una rejilla de 3 columnas con 8 px de hueco.
- **Icono del bloque** de 24 px en `on-surface-variant`, centrado sobre el anillo: `chair` para Mi hogar, `schedule` para Mi día a día y `pet_supplies` para La mascota que busco. Distingue de un vistazo tres tarjetas casi iguales (34/33/33). **No se usan iconos de la barra de navegación** (`home`, `search`, `pets`, `person`) para que no se confundan con sus destinos.
- **Anillo de 88 px** (`pp-ring--88`): trazo de 8 con extremos redondeados; activo en `primary` (como todo indicador de progreso de M3) y pista en `surface-container-highest`, con 4 px de hueco visible a cada lado.
- **Porcentaje** centrado en `numeric-large-emphasized` (Roboto 22/28 · 600).
- **Textos:** nombre del bloque en `title-small` y «5 preguntas» en `body-small`.

## Movimiento
Al aparecer, el tramo activo se llena desde 0 con el spring espacial de Expressive (900 ms). Con `prefers-reduced-motion` aparece ya lleno.

## Cálculo
r = 40, así que la circunferencia es 251,33. Con extremos redondeados de 8, el hueco del trazo es 4 + 8 = 12: activo = C·p − 12; la pista empieza en activo + 12 y mide C − activo − 24.

## Accesibilidad
Cada tarjeta es un **botón** (`<button class="pp-ring-tile pp-state">`) que abre el diálogo de su bloque (ver `Dialog`), con `aria-label` «Mi hogar, 34 % del test. Ver qué preguntas incluye» y `aria-haspopup="dialog"`; lo de dentro va con `aria-hidden`. Al pulsarla, capa de estado de M3 (`pp-state`). *Cambio del equipo, 25-11-2026: antes era `role="img"`, sin acción.*

## Fuente
Wireframe de fidelidad media: Inicio.
