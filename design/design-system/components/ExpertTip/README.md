# ExpertTip
Consejo breve que aparece justo después de una pregunta del test para que la persona responda con información, no solo con lo que desea. Hay **tres en todo el test, uno por bloque** (tras las preguntas 3, 6 y 14), para que acompañen sin convertirse en ruido. Es contenido de apoyo: debe distinguirse a primera vista de las preguntas (tarjetas blancas con borde) y no parecer una opción seleccionable.

## Anatomía
- **Contenedor relleno** en `tertiary-container` (arena), esquinas `corner-large` (16) —más redondas que las de la pregunta (12)— y relleno de 16. Sin borde.
- **Forma Expressive sunny de 48 px** en `surface-container-lowest` con el icono `lightbulb` en `on-tertiary-container`. Decorativa.
- **Antetítulo** «Sobre la pregunta {n}» en `label-medium` (12/16 · 500): ata el consejo a su pregunta.
- **Título** «Consejo del experto» en `title-medium` y **texto** en `body-medium`, todo en `on-tertiary-container` (7,97:1).

## Por qué arena y no otro color
- `secondary-container` (verde) es el color de lo seleccionado: junto a unos radios se confundiría con una respuesta marcada.
- `primary-container` (rosa) está reservado a las cabeceras destacadas.
- `tertiary` es en M3 el acento que equilibra a los otros dos: ideal para un aparte informativo. Malva y verde no aparecen dentro, así que se cumple la COL3.

## Accesibilidad
`<aside aria-labelledby>` apuntando al título; antetítulo y título se leen juntos. La forma y el icono van con `aria-hidden`.

## Reglas de uso
- **Máximo uno por bloque** y separados entre sí: el test no debe leerse como una lista de avisos.
- **Texto de unos 200 caracteres como mucho** (hasta 6 líneas en `body-medium`; el de la pregunta 6 ya ocupa 6), sin cifras ni datos que no estén verificados.
- Solo en preguntas donde la información cambia lo que la persona respondería.
- **Contenido provisional:** los tres textos son una simulación académica pensada para el wireframe; deben revisarse con una persona experta o una protectora antes de darlos por buenos.

## Tokens
`tertiary-container`, `on-tertiary-container`, `surface-container-lowest`, `corner-large`.

## Fuente
Wireframe de fidelidad media: Test de compatibilidad (preguntas 3, 6 y 14).
