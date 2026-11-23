# Splash / Primer inicio
Animación de marca que se ve **solo la primera vez que se abre la app** (después se entra directamente al Inicio). Dura **1,55 s**, no tiene texto ni barra de carga y termina en el Inicio real: el sello de la marca vuela hasta el sello de la barra superior.

## Secuencia (pantalla de 412 × 917)
1. Sobre el Inicio («sin cuenta», porque la primera vez nadie ha iniciado sesión) aparece una **capa** `surface` al 86 % con desenfoque de 5 px.
2. **4 huellas** (`Huella`, 40 px) suben desde abajo por el eje central, alternando ±23 px y ±6°: centros en y = 858, 780, 702 y 624.
3. Aparece el **sello** centrado: 239 px (58 % del ancho), centro en (206, 445). Es el mismo `pp-mark` del logo, a otro tamaño.
4. El sello **vuela** hasta el sello de 32 px de la barra (centro en 32, 32): `translate(-174px, -413px) scale(.1339)`. Aterriza sobre el círculo, no sobre el conjunto con «Pinky Pet».
5. La capa desaparece y, al terminar, se quita todo el componente: lo que queda es la barra real.

## Tiempos y curvas (tokens de movimiento de M3)
| Pieza | Duración | Retraso | Curva |
|---|---|---|---|
| Huellas (aparecen +5 px, se mantienen, se van) | 750 ms | 0 / 100 / 200 / 300 ms | `standard` (0.2, 0, 0, 1) |
| Sello entra (opacidad 0 → 1, escala 0,92 → 1, sin rebote) | 450 ms (long1) | 350 ms | `emphasized decelerate` (0.05, 0.7, 0.1, 1) |
| Vuelo a la barra | 500 ms (long2) | 1050 ms | `emphasized` (en web, 0.2, 0, 0, 1) |
| Capa desaparece | 450 ms (long1) | 1100 ms | `emphasized accelerate` (0.3, 0, 0.8, 0.15) |
| Fin: el componente se oculta | — | 1550 ms | — |

El documento de partida proponía `(.25, .8, .25, 1)` y `(.4, 0, .2, 1)`; no son curvas de M3 (la segunda es de Material 2), así que se sustituyen por las de M3.

## Variantes
| Tema | Sello | Huella del sello | Huellas que caminan | Capa |
|---|---|---|---|---|
| Claro | `primary` #734863 | `on-primary` #FFFFFF | `primary` al 50 % | `surface` #FDF8F7 al 86 % |
| Oscuro | `primary` #EEB7D6 | `on-primary` #49243C | `primary` al 70 % | `surface` #141313 al 86 % |

En Oscuro, `[data-theme="dark"]` (o `pp-splash--dark`) sube la opacidad de las huellas a 0,7, porque al 0,5 se pierden sobre el fondo oscuro.

## Reglas
- **Solo el primer inicio.** La app guarda que ya se vio; las siguientes veces abre el Inicio sin animación.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` no se muestra nada y se ve el Inicio directamente.
- **Accesibilidad:** todo el componente es decorativo (`aria-hidden="true"`). Mientras dura, la capa recibe los toques para que no se pulse nada por debajo; al terminar se oculta y el foco empieza en el Inicio. Dura menos de 5 s y no parpadea.
- **Capa:** M3 no tiene un rol para esta capa (su `scrim` es negro al 32 %). Se usa `surface` con transparencia: no es un color nuevo, es un rol del tema mezclado con transparente.
- **Plataforma:** en Android 12 o posterior el sistema muestra antes su propia pantalla de arranque con el icono. Esta animación es una **transición de primer inicio** que va después, no sustituye a esa pantalla.
- Sin texto, sin huellas en horizontal y sin rebote.

## Uso
Dentro de la pantalla (`position: relative`), encima del Inicio: `<div class="pp-splash pp-splash--run" aria-hidden="true">` con `pp-splash__scrim`, 4 `pp-paw pp-splash__print` (variables `--i`, `--x`, `--y`, `--r`) y `pp-mark pp-splash__seal`. Para repetirla en un prototipo, se quita y se vuelve a poner `pp-splash--run`.

## Tokens
`primary`, `on-primary`, `surface`; curvas `--pp-ease-standard`, `--pp-ease-emphasized`, `--pp-ease-emphasized-decelerate`, `--pp-ease-emphasized-accelerate`.

## Fuente
Wireframe de fidelidad media: no estaba en el wireframe; se añade en alta fidelidad (animación de primer inicio).
