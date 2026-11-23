# NavigationBar
Barra de navegación inferior de 64 px con 4 destinos fijos.

## Destinos e iconos establecidos
| Destino | Icono |
|---|---|
| Inicio | `home` |
| Mascotas | `search` |
| Proceso | `hourglass_empty` |
| Mi perfil | `person` |

## Estados
- **Activo** (`aria-current="page"`): indicador de 56 × 32 en `secondary-container`, icono relleno en `on-secondary-container` y etiqueta en `on-surface`, peso 700. Al seleccionarse, el icono anima su relleno (eje `FILL` 0 → 1, 300 ms, curva de efectos).
- **Inactivo**: icono outline y etiqueta en `on-surface-variant`, peso 500.

## Accesibilidad
`<nav aria-label="Navegación principal">`. Cada enlace lleva un `aria-label` como «Inicio, pestaña 1 de 4, seleccionada».

## Texto grande (ACC1)
El alto es un **mínimo** (64 px): con el tamaño de letra del sistema al máximo, la barra crece en vez de cortar iconos o etiquetas. Cuando las 4 etiquetas no caben (texto a partir del 150 %, aprox.), se añade `pp-navbar--label-activa`: **solo la pestaña activa muestra su etiqueta**, patrón de M3 (*label visibility: selected*). Las demás conservan el icono y su `aria-label`, así que el nombre sigue llegando al lector de pantalla. A tamaño normal no cambia nada.

## Tokens
`surface-container`, `secondary-container`, `on-secondary-container`, `on-surface`, `on-surface-variant`, `corner-full`.

## Fuente
Wireframe de fidelidad media: TabBar; todas las pantallas excepto Login y Registro.
