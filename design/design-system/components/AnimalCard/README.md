# AnimalCard
Tarjeta de mascota de Mascotas y de Compatibles, en una rejilla de 2 columnas con 8 px de hueco.

## Anatomía (de arriba abajo)
1. `MediaPlaceholder` de 128 px **a sangre** (ocupa todo el ancho de la tarjeta, sin el relleno de 16 px; el texto de debajo mantiene su margen) y con las esquinas superiores de la tarjeta, con fondo `tertiary-container` (arena) e icono y texto en `on-tertiary-container` (7,97:1).
2. `Tag` «Necesidades especiales» (opcional).
3. Nombre en `title-medium-emphasized`.
4. Línea 1 «Sexo · edad» («Hembra · 3 años») en `body-medium`; línea 2 «Ciudad · tamaño» («Barcelona · Pequeño») en `on-surface-variant`.
5. `CompatibilityMeter` con motivo corto (solo con el test hecho).
6. Espaciador flexible, divisor y **botón tonal S** en un área de 48 px (acción repetida: el relleno queda para la acción principal de la pantalla).

## Variantes
| Estado del usuario | Botón | Nombre accesible |
|---|---|---|
| Sin test (invitado o registrado) | «Ver compatibilidad» → Registro o Test | «Ver compatibilidad: hacer el test para ver la ficha de {nombre}» |
| Con test (Compatibles) | «Más información» → Ficha | «Más información sobre {nombre}» |

Con el test hecho, la lista se ordena de mayor a menor compatibilidad.

## Reglas
Todas las tarjetas de una fila tienen la misma altura y el botón queda siempre abajo. El `<article>` lleva `aria-label` con el nombre.

## Tokens
`surface-container-lowest`, `outline-variant`, `on-surface`, `on-surface-variant`, `primary`, `tertiary-container`, `on-tertiary-container`, `secondary-container`, `on-secondary-container`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Mascotas, Compatibles.
