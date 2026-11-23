# Shapes
Formas de la librería de formas de M3 Expressive que usa Pinky Pet. Aportan personalidad sin color ni iconos nuevos, con el contenido encima.

| Forma | Uso |
|---|---|
| cookie-4 | Estado vacío «sin resultados» (96) · paso 1 del proceso (48) |
| soft-burst | Estado vacío «sin conexión» (96) · paso 2 del proceso (48) |
| cookie-9 | Estado vacío «sin compatibles» (96) · paso 3 del proceso (48) |
| sunny | Estado vacío «sin solicitud» (96) · paso 4 del proceso (48) |
| las cuatro en secuencia | Indicador de carga del botón (24): la forma muta y gira |

## Implementación
SVG en línea (`<path>` de 120 puntos en coordenadas polares, todas las formas con el mismo número de puntos para poder mutar entre ellas), dentro de `pp-shape pp-shape--96` o `--40`, con la clase `pp-shape__fill`. Decorativas: `aria-hidden="true"`.

## Reglas
Una forma por estado vacío o paso, siempre la misma para el mismo caso. En los estados vacíos van en `surface-container-highest`; en los pasos del proceso, el color de la forma indica el estado (hecho, actual o pendiente). No se usan como botones.

## Fuente
Wireframe de fidelidad media: estados vacíos, Cómo adoptar, carga del botón.
