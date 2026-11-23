# Pinky Pet

Librería de componentes de la app de adopción Pinky Pet, sobre **Material 3 Expressive**.

**Fuente de verdad: el wireframe de fidelidad media.** Cada componente de esta librería se ha extraído de sus pantallas, con sus medidas, colores, iconos y textos. Si wireframe y librería no coinciden, manda el wireframe y se corrige la librería. El «Manual de componentes» anterior ya no se actualiza: lo que sigue vigente de él está recogido en esta página.

## Cómo usarla

- **Tokens** (`tokens.json`): roles de color M3, escala tipográfica base y enfatizada, forma, espaciado, elevación, opacidades de estado y medidas. En CSS: `var(--primary)`, `var(--corner-medium)`, `var(--space-4)`…
- **Componentes** (`components/bundle.css`): clases con prefijo `pp-`. Envuelve la pantalla en `.pp-root`. Cada componente tiene su guía, con la pantalla del wireframe de la que sale, y una vista previa en vivo.
- **Lienzo**: 412 × 917 (Android, 412 dp de ancho, como pide el brief). El contenido se recoloca; no se escala.
- **Fuentes**: Fraunces (variable: opsz, wght, SOFT, WONK) para títulos, Roboto (400 · 500 · 600 · 700) para el resto y Material Symbols Rounded, desde Google Fonts. En CSS: `var(--font-brand)` y `var(--font-sans)`.
- **Logotipo**: grupo de assets *Logotipo* (`isotipo.svg`, `isotipo-invertido.svg`, `isotipo-una-tinta.svg`, `huella-p.svg`); guía en el componente `Logo`.
- **Ilustraciones**: grupo de assets *Ilustraciones* (`gato.png`, `perro.png` y `otros.png`: selector de tipo y cabeceras).

## Fuentes de la librería

| Fuente | Qué se toma |
|---|---|
| Wireframe de fidelidad media (proyecto Design) | Inventario de componentes, anatomía, medidas, estados, iconos, ilustraciones y textos literales. **Manda.** |
| Export de Material Theme Builder del 17/11/2026, 09:35 (primary `#8E607C` malva, secondary `#60898C`, tertiary `#F5EDD3`, neutral `#8A857D`) | Los 6 esquemas de roles de color y las paletas tonales, con 5 roles del esquema Claro sustituidos por tonos del propio JSON (ver Color). Sustituye al export «material-theme-pinky-pet-AA» (COL1). No incluye tipografía, formas ni espaciado. |
| Especificación de M3 / M3 Expressive | Escala tipográfica (base + enfatizada), escala de forma, capas de estado, progreso con hueco y punto de parada, morph de forma al pulsar. |
| Materiales del curso | Orden del foco, etiquetas visibles y área táctil (WCAG 2.4.3, 3.3.2, 2.5.8). |
| Manual de componentes (archivado) | Decisiones, discrepancias, patrones de texto y dudas pendientes, recogidos abajo. |

## Marca

**Imagotipo (BR1):** sello circular en `primary` con una **«p» hecha con una huella** en `on-primary`, y «Pinky Pet» en **Fraunces 900** en `primary` (tracking −0,5). Va en la barra superior de las pantallas raíz. Versiones del isotipo: principal, invertido (sobre malva), a una tinta (blanco y negro) y la huella sola. Tamaño mínimo 24 px. Reglas y contrastes: componente `Logo`.

**Primer inicio (MOV1):** la primera vez que se abre la app, 4 huellas suben hasta el sello, que vuela a la barra superior del Inicio (1,55 s, sin texto). Componentes `Huella` y `SplashPrimerInicio`.

## Contenido y tono

- **Tú, cercano y claro.** «¿Qué mascota encaja contigo?», «Haz el test y verás las mascotas compatibles con tu hogar».
- **Botones con verbo + objeto.** «Enviar solicitud de adopción», «Seguir mirando otras mascotas». Nunca «Aceptar» ni «OK».
- **Confirmaciones que nombran a la mascota y la consecuencia.** «¿Seguro que quieres cancelar tu solicitud para adoptar a Luna?» + «La protectora dejará de revisarla».
- **Errores que dicen qué ha pasado y qué hacer.** «Comprueba tu wifi o tus datos móviles e inténtalo de nuevo.»
- **El resultado orienta, no decide.** «Este resultado te orienta según tus respuestas. La protectora te ayudará a confirmar el encaje.»
- **Datos que faltan:** siempre «Dato no disponible».
- **Formato:** «92 %» con espacio, metadatos separados por « · », castellano, sin mayúscula interior («Mi perfil») y sin emojis.

## Color

Paleta del export de Material Theme Builder del **17/11/2026 (09:35)**, con el **malva como protagonista**: primary `#8E607C` (malva), secondary `#60898C` (azul verdoso), tertiary `#F5EDD3` (arena) y neutral `#8A857D`. **Sustituye a la paleta COL1 (azul verdoso como primary) y a la decisión D1 («solo grises»).** Todos los valores salen del JSON; no se ha inventado ninguno.

> **Excepción documentada: 5 roles sustituidos en el esquema Claro.** El export trae los contenedores en modo fidelidad (primary-container = la semilla `#8E607C`, secondary-container `#537B7E`), que son colores oscuros y no sirven como fondos tonales de M3. El brief pedía sustituirlos por tonos claros, pero esos tonos no venían en el JSON. Se han sustituido por los **tonos estándar de M3 (contenedor = tono 90, texto sobre él = tono 30) de las paletas del propio JSON**:
>
> | Rol | Export | Sustituido por |
> |---|---|---|
> | `primary-container` | `#8E607C` | `#FFD8EC` (primary 90) |
> | `on-primary-container` | `#FFEDF4` | `#633A54` (primary 30) |
> | `secondary-container` | `#537B7E` | `#BFEAED` (secondary 90) |
> | `on-secondary-container` | `#F4FFFF` | `#234D50` (secondary 30) |
> | `on-tertiary-container` | `#706B56` | `#4B4734` (tertiary 30) |
>
> **Por qué el tono 90 y no el 95/98 que proponía el brief:** con 95/98 los contenedores casi no se distinguen del fondo (1,07:1 y 1,00:1 frente a `surface`); con 90 llegan a 1,22:1 y 1,23:1, que es lo que M3 prevé para un fondo tonal, y todos los textos sobre ellos superan 7:1. Por eso algunos ratios difieren de los del brief (ver la tabla de contraste).

Se han importado los 6 esquemas (claro y oscuro, en contraste estándar, medio y alto). Están validados el **Claro** y el **Oscuro**; los 4 de contraste medio y alto quedan tal como salen del export (D7).

### Esquema Oscuro (OSC1)
El export con *Color match* deja los contenedores oscuros cerca del color de origen: la arena (`tertiary-container` `#EAE2C9`) salía casi blanca sobre el fondo oscuro (14,3:1, un bloque que deslumbra) y los textos sobre contenedores se quedaban en 4,5:1. Se aplica la misma asignación estándar de M3 que en el Claro, invertida: **contenedor = tono 30, su contenido = tono 90**, y `tertiary` = tono 80.

> | Rol | Export | Oscuro validado |
> |---|---|---|
> | `primary-container` | `#8E607C` | `#633A54` (primary 30) |
> | `on-primary-container` | `#FFEDF4` | `#FFD8EC` (primary 90) |
> | `secondary-container` | `#6F989B` | `#234D50` (secondary 30) |
> | `on-secondary-container` | `#001E20` | `#BFEAED` (secondary 90) |
> | `tertiary` | `#FFFFFF` | `#CEC6AE` (tertiary 80) |
> | `tertiary-container` | `#EAE2C9` | `#4B4734` (tertiary 30) |
> | `on-tertiary-container` | `#696450` | `#EAE2C9` (tertiary 90) |

**Contraste en Oscuro** (fondo `surface` `#141313`): `on-surface` 14,9:1 · `on-surface-variant` 10,9:1 · `primary` 10,9:1 · `outline` 5,9:1 · `error` 10,9:1 · texto sobre los tres contenedores 7,2:1 · `primary` sobre `primary-container` 5,5:1 · `on-error-container` sobre `error-container` 7,2:1. Los contenedores se separan del fondo 2,0:1: son fondos tonales, no contornos.

**Consecuencia de diseño:** en oscuro la arena pasa a un pardo oliva (`#4B4734`). Pierde la calidez de la arena clara, pero conserva su papel (Consejo del experto, casillas de datos, hueco de foto). Las fotos y las ilustraciones no cambian entre esquemas.

### Asignación de roles (según la especificación de M3)

| Elemento del wireframe | Rol |
|---|---|
| Fondo de pantalla, barra superior | `surface` |
| Zona inferior (barra de acciones + navegación), menú, barra superior con scroll | `surface-container` |
| Búsqueda y diálogos | `surface-container-high` |
| Formas Expressive de estados vacíos, pista de progreso | `surface-container-highest` |
| Tarjetas outlined (ficha, resultados del test, pregunta, tarjeta de mascota, tarjetas de anillo) | `surface-container-lowest` + borde `outline-variant` |
| Logotipo (círculo de la barra superior) | `primary` |
| Botón relleno (acción principal) | `primary` / `on-primary` |
| Botón tonal («Ver compatibilidad» / «Más información» de la tarjeta de mascota) | `secondary-container` / `on-secondary-container` |
| Botón outlined y botones de texto | texto `primary`; borde `outline-variant` (outlined) |
| Navigation bar | fondo `surface-container`; indicador activo `secondary-container`; icono activo `on-secondary-container`; etiqueta activa `on-surface`; inactivos `on-surface-variant` |
| Chip de filtro, tarjeta de tipo y opción de menú seleccionados | `secondary-container` + texto, icono y check en `on-secondary-container` |
| Cabeceras de Inicio y de Cómo adoptar (HomeHero, ProcessHero) | `primary-container` con títulos y texto en `on-primary-container`; botón `primary` / `on-primary` |
| Compatibilidad: cifra «92 %», tramo activo y punto de parada de la barra | `primary`; pista `surface-container-highest` |
| Insignia de % del carrusel | texto `primary` sobre `surface-container-lowest` |
| Anillos de peso de bloque en Inicio | tramo activo `primary`; pista `surface-container-highest` |
| Foto de la mascota: tarjeta, carrusel y ficha (placeholder) | `tertiary-container` / `on-tertiary-container` |
| Píldora de compatibilidad sobre la foto de la ficha | «92 %» en `primary` + «compatible» en `on-surface`, sobre `surface-container-lowest` |
| Datos clave de la ficha (FactTiles) | `surface-container`; valor `on-surface`, etiqueta `on-surface-variant` |
| Consejo del experto del test (ExpertTip) | `tertiary-container` / `on-tertiary-container`; forma en `surface-container-lowest` |
| Motivos de «Resultados de tu test» | forma Expressive en `secondary-container`, icono `on-secondary-container` |
| Etiqueta «Necesidades especiales» | borde `outline`, texto `on-surface-variant` |
| Pasos del proceso | actual `primary` / `on-primary`; pendientes `secondary-container` con número en `secondary`; hechos `on-surface` con `check` en `surface-container-lowest` |
| Foco, icono de diálogo | `secondary` |
| Texto principal / secundario | `on-surface` / `on-surface-variant` |
| Bordes de control / bordes suaves | `outline` / `outline-variant` |
| Errores (siempre con icono y texto) | `error`, `error-container`, `on-error-container` |
| Estado «Adopción finalizada» | `inverse-surface` / `inverse-on-surface` |
| Sin uso en componentes | `tertiary` (`#635E4A`), reservado |

### Reglas de color

- **El malva (`primary`) es el color de marca y de acción**: botón relleno, logotipo, compatibilidad, paso actual, selección y foco de campos.
- **`primary-container` (rosa pálido) solo en tarjetas destacadas** (HomeHero y ProcessHero), nunca como fondo de pantalla ni en botones.
- **El % de compatibilidad siempre en `primary`**, sea alto o bajo: sin rojo, ámbar, verde ni degradados, y siempre acompañado de la palabra «compatible» (o de su `aria-label`).
- **El malva y el verde nunca se superponen.** Nada en `primary` ni `primary-container` va sobre `secondary-container` (ni sobre `secondary`), y al revés. Cada familia se usa con sus propios tonos: sobre verde, `on-secondary-container` o `secondary`; sobre rosa, `on-primary-container` o `primary`. Pueden convivir uno al lado del otro, pero no uno encima del otro.
- **El azul verdoso (`secondary`) es de apoyo** (selección tonal, foco, pasos pendientes) y **nunca indica «éxito»**.
- **La arena (`tertiary-container`) solo para huecos de foto, el Consejo del experto (`ExpertTip`) y las 4 casillas de datos de la Ficha (`FactTiles`)**, siempre con `on-tertiary-container` encima. Nunca en avisos, estados ni botones.
- **`outline` solo para bordes**, nunca como color de texto.

### Contraste (WCAG 2.2, esquema Claro)

Mínimos: 4,5:1 en texto normal; 3:1 en texto grande, iconos y bordes de controles.

| Par (texto o elemento / fondo) | Ratio | Uso |
|---|---|---|
| `on-primary` / `primary` | 7,40:1 | Botón relleno, número del paso actual |
| `primary` / `surface` | 7,03:1 | Logotipo, botones outlined y de texto, campo con foco |
| `primary` / `surface-container-lowest` | 7,40:1 | Cifra de compatibilidad, insignia del carrusel, radio y checks en tarjetas |
| `primary` / `surface-container-highest` | 5,75:1 | Tramo activo frente a la pista (barra y anillos) |
| `on-primary-container` / `primary-container` | 7,19:1 | Títulos y texto de HomeHero y ProcessHero |
| `on-secondary-container` / `secondary-container` | 7,21:1 | Botón tonal, icono de la pestaña activa, chip, tipo (con su check) y menú seleccionados; iconos de los motivos de la ficha |
| `secondary` / `secondary-container` | 5,20:1 | Número de paso pendiente |
| `on-tertiary-container` / `tertiary-container` | 7,97:1 | Icono y texto del hueco de foto; texto del Consejo del experto |
| `primary` / `surface-container-lowest` | 7,40:1 | Cifra de la píldora sobre la foto de la ficha |
| `on-surface-variant` / `surface-container` | 8,00:1 | Etiquetas de FactTiles |
| `on-surface` / `surface` | 16,32:1 | Texto principal |
| `on-surface` / `surface-container` | 14,77:1 | Etiqueta de la pestaña activa, opción de menú |
| `on-surface-variant` / `surface` | 8,84:1 | Texto secundario |
| `on-surface-variant` / `surface-container` | 8,00:1 | Pestañas inactivas |
| `on-surface-variant` / `surface-container-high` | 7,60:1 | Texto de la búsqueda, cuerpo de diálogo |
| `on-surface-variant` / `surface-container-highest` | 7,24:1 | Iconos de estados vacíos |
| `on-surface-variant` / `surface-container-lowest` | 9,31:1 | Etiqueta «Necesidades especiales», metadatos de tarjeta |
| `secondary` / `surface` | 6,40:1 | Anillo de foco, icono de diálogo |
| `error` / `surface` | 6,14:1 | Borde, texto de ayuda e icono de campos con error |
| `on-error-container` / `error-container` | 7,24:1 | Texto del aviso de error |
| `error` / `error-container` | 5,00:1 | Icono del aviso de error |
| `on-error` / `error` | 6,46:1 | Texto sobre `error` (reservado) |
| `inverse-on-surface` / `inverse-surface` | 11,63:1 | Estado «Adopción finalizada» |
| `outline` / `surface` | 4,23:1 | Solo bordes: campo de texto, etiquetas |
| `outline-variant` / `surface` | 1,62:1 | Bordes suaves (ver nota) |
| `secondary-container` / `surface-container` | 1,11:1 | Indicador de la pestaña activa (ver nota) |

**Nota sobre `outline-variant` (1,62:1).** No llega a 3:1, pero los bordes de botón outlined, chip sin seleccionar y tarjetas no son lo que identifica el control: lo identifican su texto o su contenido (WCAG 1.4.11 solo exige 3:1 a lo que es necesario para identificar el componente). Es el uso que M3 define para este rol.

**Nota sobre el indicador de la navigation bar (1,11:1).** La píldora es débil frente a la barra, pero el estado activo no depende solo de ella: el icono pasa a relleno y la etiqueta a `on-surface` en negrita. Cumple 1.4.11 por esa vía; aun así conviene comprobarlo en el test con usuarios. Todos los ratios están calculados, no probados en dispositivo.

## Tipografía

Dos familias, tal como prevé M3 con sus tokens *brand* y *plain*:

| Familia | Rol M3 | Estilos | Para qué |
|---|---|---|---|
| **Fraunces** | brand | display, headline y title-large (también sus versiones enfatizadas) | Títulos y encabezados: titular de Inicio, títulos de pantalla, nombre de la mascota, encabezados de sección y de bloque, títulos de diálogo, de estado vacío y de resultado, barra superior y logotipo «Pinky Pet». |
| **Roboto** | plain | title-medium, title-small, body y label | Todo lo demás: cuerpo, botones, chips, navegación, campos, títulos de tarjeta, preguntas del test y listas. |

**Tamaños, interlineados y tracking no cambian:** son los de la escala de M3. Cambiar de familia no cambia la escala, así que los espaciados y paddings de los componentes siguen igual.

**Por qué Fraunces solo hasta title-large.** M3 aplica la fuente de marca a display, headline y title-large, y deja la funcional para title-medium hacia abajo. Por debajo de 22 px una serif con tanto contraste de trazo pierde legibilidad en pantalla, y esos estilos están dentro de controles (títulos de tarjeta, preguntas, botones), donde lo que importa es leer rápido.

**Las cifras van en Roboto** (`numeric-large-emphasized`, 22/28 · 600): «92 % compatible», los porcentajes de los anillos y los números de paso. Miden lo mismo que un title-large, pero son datos, no títulos, y Roboto es más neutra y regular para comparar números.

**Ajustes de Fraunces:** tamaño óptico automático (`font-optical-sizing: auto`, el eje `opsz` se adapta a cada tamaño), `SOFT` 50 (remates algo más redondeados, que casan con los iconos Rounded y las formas Expressive) y `WONK` 0 (sin las letras «inclinadas» decorativas, para que los títulos se lean serenos).

**Pesos:** los de la escala de M3 y de la enfatizada de Expressive: 400 en los estilos base (barra superior, secciones, diálogos) y 600 en los enfatizados (titulares, títulos de pantalla, nombre de la mascota, encabezado de bloque).

- Titular de la cabecera de Inicio y nombre de la mascota: `display-small-emphasized` (Fraunces 36/44 · 600).
- Título de pantalla: `headline-large-emphasized` (Fraunces 32/40 · 600).
- Titular de cabecera de Cómo adoptar y tarjeta promo: `headline-small-emphasized` (Fraunces 24/32 · 600).
- Diálogos, estados vacíos y resultados: `headline-small` (Fraunces 24/32 · 400).
- Barra superior y secciones: `title-large` (Fraunces 22/28 · 400).
- Título de bloque del test y nombre en la tarjeta de estado: `title-large-emphasized` (Fraunces 22/28 · 600).
- Cifras: `numeric-large-emphasized` (Roboto 22/28 · 600).
- Títulos de tarjeta y preguntas: `title-medium` (Roboto 16/24 · 500).
- Cuerpo: `body-large` 16/24, `body-medium` 14/20, `body-small` 12/16 (Roboto).
- Botones: M a 16/24 · 500; S y de texto a 14/20 · 500 (Roboto).

## Forma y movimiento (Expressive)

- **Escala de forma:** 4 · 8 · 12 · 16 · 20 · 28 · 32 · 48 · píldora. El wireframe usa 4 (campo, menú), 8 (chip, etiqueta, foto de tarjeta), 12 (tarjetas, avisos), 16 (foto de ficha), 28 (diálogo) y píldora (botones, búsqueda, pestaña, estado).
- **Morph de forma** con el spring espacial rápido (`--pp-ease-spatial-fast`, 350 ms):
  - botones al pulsar: M de píldora a 12, S a 8;
  - tarjeta de tipo al seleccionarse: 12 → 20;
  - chip de filtro al seleccionarse: 8 → 12.
- **Librería de formas:** cookie-4, soft-burst, cookie-9 y sunny detrás de los iconos de los estados vacíos (96) y como marcador de cada paso del proceso (48), donde el color de la forma indica si el paso está hecho, es el actual o está pendiente. Ver el componente Shapes.
- **Indicador de carga Expressive:** forma que muta y gira dentro del botón mientras se envía la solicitud.
- **Color antes que líneas o sombras:** la barra superior cambia de `surface` a `surface-container` al hacer scroll, y la barra de acciones no lleva borde (comparte tono con la de navegación). Solo el menú lleva sombra.
- **Progreso Expressive:** barra lineal de 8 px con hueco de 4 px y punto de parada; anillo circular con hueco entre el tramo activo y la pista (en Inicio, de 88 px con extremos redondeados, que se llena al aparecer).
- **Carrusel Expressive (sin contener)** en Inicio: tarjetas de 160 × 200 con esquinas de 28 que se cuadran a 16 al pulsar.
- **Efectos** (color, opacidad, capa de estado, relleno del icono de la pestaña activa): 150–300 ms sin rebote. Con `prefers-reduced-motion` no hay rebote.
- **Curvas de M3 (MOV1)** para transiciones que no son de forma: `--pp-ease-standard` (0.2, 0, 0, 1), `--pp-ease-emphasized` (en web, la misma curva), `--pp-ease-emphasized-decelerate` (0.05, 0.7, 0.1, 1) para lo que entra y `--pp-ease-emphasized-accelerate` (0.3, 0, 0.8, 0.15) para lo que sale. Duraciones de M3: long1 450 ms, long2 500 ms. Las usa el primer inicio.

## Iconografía establecida

Material Symbols **Rounded**, 24 px (`opsz` 24, peso 400): los remates redondeados casan con las píldoras y las esquinas grandes de Expressive. Relleno (`FILL 1`) solo en estado activo o de error, y en la pestaña activa se anima de 0 a 1: pestaña activa, `check_circle` de la tarjeta seleccionada, `error` en avisos y campos. Siempre `aria-hidden="true"`; el control lleva su `aria-label`.

| Icono | Dónde |
|---|---|
| `home` · `search` · `hourglass_empty` · `person` | Navigation bar: Inicio · Mascotas · Proceso · Mi perfil. Reservados para la navegación: no se usan como iconos decorativos en otros componentes |
| `chair` · `schedule` · `pet_supplies` | Bloques del test en las tarjetas de anillo de Inicio: Mi hogar · Mi día a día · La mascota que busco |
| `arrow_back` | Volver, en la barra superior |
| `location_on` | Ubicación de la mascota en la cabecera de la ficha (AnimalHeader) |
| `check` · `lightbulb` | Motivos de «Resultados de tu test»: Lo que encaja contigo · Para que os vaya bien. `lightbulb` también en el Consejo del experto: siempre significa «consejo» |
| `search` | Barra de búsqueda |
| `check` · `arrow_drop_down` | Chips de filtro y menú; `check` también en pasos hechos y en los requisitos (Checklist) |
| `check_circle` | Tarjeta de tipo seleccionada; diálogo «Solicitud enviada»; nota «Qué significa el resultado» |
| `filter_alt_off` | «Quitar filtros» |
| `person_add` · `login` | «Regístrate» · «Inicia sesión» |
| `close` | «Cancelar solicitud»; paso detenido |
| `error` | Avisos, campos y preguntas con error; diálogos de error |
| `image` | Placeholder de foto |
| `search_off` · `wifi_off` · `pets` · `assignment` | Estados vacíos: sin resultados · sin conexión · sin compatibles · sin solicitud |
| Ilustraciones `gato.png` · `perro.png` | Tarjetas de tipo «Gatos» y «Perros», y cabeceras de Inicio y de Cómo adoptar. No son iconos: van a color y no siguen los roles de color |
| Isotipo (`pp-mark`) | Tarjeta de tipo «Otros», a 40 px dentro del círculo claro. Es la marca, no un icono: sigue los roles `primary` / `on-primary` |

No se añaden iconos fuera de esta lista sin cambiar antes el wireframe.

## Espaciado, layout y accesibilidad

- Rejilla de 4 px. Margen lateral de 16, 24 entre secciones y 8 en las rejillas de tarjetas.
- En las zonas con scroll, los bloques y botones mantienen su altura (`flex-shrink: 0`): se desplaza el contenido, nunca se comprime un control.
- Área táctil de 48 px como mínimo, aunque el control se vea más pequeño (chip de 32, botón S de 40, radio de 20).
- Foco: anillo de 3 px en `secondary`, separado 2 px. Capas de estado: hover 8 %, foco 10 %, pulsado 10 %.
- Contraste: ver la tabla de la sección Color (WCAG 2.2, esquema Claro).
- Controles reales (`<button>`, `<a>`, `<input>` con `<label>`), `aria-pressed` en lo conmutable, `aria-current` en navegación y pasos, `role="alert"` en errores y `aria-live` en contadores.

### Texto grande (ACC1)
Prueba en el lienzo: 6 pantallas con todo el texto al 200 % (tamaño de letra del sistema al máximo; Android llega al 200 %; WCAG 1.4.4). Fallaban la barra de navegación (iconos fuera de la franja, etiquetas pegadas) y los botones (texto desbordado o encima de otros elementos). Reglas:
- **Alto mínimo, no fijo**, en todo control con texto: botones (56 / 40 / 48), barras superior e inferior (64), búsqueda (56), chips (32), elementos de menú (48), etiquetas (24), píldoras (28 / 32) y filas de pasos (40). Los botones llevan 8 px de relleno vertical y su texto puede pasar a dos líneas. A tamaño normal no cambia nada.
- **Barra de navegación:** si las 4 etiquetas no caben, `pp-navbar--label-activa` muestra **solo la de la pestaña activa** (patrón de M3, *label visibility: selected*); las demás conservan icono y `aria-label`.
- Iconos, indicadores y huecos de foto no crecen con el texto: se miden en dp.
- Que la pantalla se alargue y haya que desplazarse más es correcto; lo que no se admite es texto cortado o superpuesto.
- La prueba con zoom del navegador al 200 % (206 px de ancho) es solo una prueba de estrés: más exigente que WCAG 1.4.10 (320 px) y no aplica a una app nativa.

## Fotos de mascotas (especificación)
Las fotos actuales son una **simulación académica**: no son mascotas reales. La especificación queda fijada para que, al subir las originales, solo haya que sustituir los archivos.

**Huecos de foto en la app** (tamaños de la maqueta a 412 px de ancho):
| Hueco | Dónde | Tamaño | Proporción | Esquinas |
|---|---|---|---|---|
| Hero | Ficha (`AnimalHeader`) | 380 × 280 | 19:14 (≈ 1,36) | `corner-extra-large` (28) |
| Tarjeta | Mascotas (`AnimalCard`) | 184 × 128, a sangre | 23:16 (≈ 1,44) | las de la tarjeta, arriba (11) |
| Carrusel | Inicio con sesión (`Carousel`) | 160 × 200 | 4:5 (0,8) | `corner-extra-large` (28) |

**Archivo maestro:** una sola foto por mascota, **horizontal 4:3, mínimo 1200 × 900 px** (el hueco mayor mide 380 px, así que 760 px bastan para pantallas de doble densidad), JPG o WebP, hasta 500 KB. De ella salen los tres recortes con `object-fit: cover` y `object-position: 50% 30%` (la cara suele estar en el tercio superior), así que **la mascota debe quedar en el centro: dentro del 60 % central del ancho y del 80 % central del alto**. Con eso el recorte vertical del carrusel (conserva el 60 % del ancho) y el de la tarjeta (conserva el 93 % del alto) no cortan la cara.

**Nombre del archivo:** el nombre de la mascota en minúsculas y sin tildes: `coco.jpg`, `kira.jpg`, `luna.jpg`, `nube.jpg`, `rocky.jpg`, `simba.jpg`. En el lienzo cada foto se sube como recurso y las pantallas que la usan (Ficha, Mascotas e Inicio) la leen de una tabla `FOTO` indexada por el nombre de la mascota, con su texto alternativo. Para sustituir una foto: subir la nueva y cambiar su dirección en esa tabla de las 3 pantallas.

**Reglas:**
- El fondo arena (`tertiary-container`) queda detrás: se ve mientras la foto carga y si falla.
- Cada foto lleva un **texto alternativo** propio y descriptivo («Luna, gata blanca y gris, sentada»). Los huecos sin foto siguen siendo decorativos (`aria-hidden`).
- La píldora de compatibilidad y el nombre llevan **fondo sólido propio** (`surface-container-lowest`), nunca texto suelto sobre la foto: el contraste no puede depender de la imagen.
- Una foto que no cumpla el encuadre se recorta de nuevo, no se deforma.

## Inventario de componentes

| Grupo | Componente | Pantallas del wireframe |
|---|---|---|
| Acciones | Button | Todas |
| | IconButton | Ficha, Test, Estado, Login, Registro |
| Navegación | TopAppBar | Todas |
| | NavigationBar | Todas menos Login y Registro |
| | SearchBar | Inicio (bajo la barra superior con el logotipo) |
| | BottomActionBar | Ficha, Test |
| Contenedores | Card | Inicio, Mascotas, Test, Ficha, Estado, Mi perfil |
| | MediaPlaceholder | Mascotas, Compatibles |
| | InfoGroup | Ficha (Salud y cuidados · Carácter y convivencia) |
| | List | Ficha (dentro de InfoGroup), Mi perfil |
| | Divider | Login, Registro, tarjeta de mascota |
| | Checklist | Cómo adoptar (requisitos) |
| Selección y entrada | SelectableCard | Mascotas |
| | FilterChip | Mascotas |
| | Menu | Mascotas (provincias) |
| | Question | Test |
| | TextField | Login, Registro |
| Comunicación | Tag | Mascotas, Ficha, Estado |
| | Banner | Login, Registro, Test |
| | Dialog | Ficha, Estado |
| | ExpertTip | Test (tras las preguntas 3, 6 y 14) |
| | EmptyState | Mascotas, errores, Sin compatibles, Sin solicitud |
| Datos | CompatibilityMeter | Compatibles, Ficha |
| | ProgressRing | Inicio (en tarjeta) |
| | Stepper | Estado de la solicitud |
| | FactTiles | Ficha |
| Patrones | HomeHero | Inicio |
| | Carousel | Inicio |
| | Shapes | Estados vacíos, pasos del proceso, carga del botón |
| | AnimalCard | Mascotas, Compatibles |
| | ActiveFilters | Mascotas |
| | StatusCard | Estado de la solicitud |
| | AnimalHeader | Ficha |
| | TestResults | Ficha |
| | ProcessHero | Cómo adoptar |
| | ProcessSteps | Cómo adoptar |
| | AccountPrompt | Inicio, Mi perfil, Login, Registro |
| | TextPatterns | Todas |
| Marca | Huella | Primer inicio (huellas que caminan) |
| | SplashPrimerInicio | Primer inicio, sobre Inicio · sin cuenta (solo la primera vez) |

No forman parte de la librería porque el wireframe no los usa: FAB, botón dividido, grupos de botones, toolbars, tabs, hojas inferiores, checkbox, snackbar e indicador de carga independiente (solo existe dentro del botón).

## Decisiones cerradas

| # | Decisión |
|---|---|
| D1 | ~~De momento solo grises~~ **Sustituida (17/11)** por la paleta de color del export de Material Theme Builder; hoy, la paleta malva de la COL2 (ver Color). |
| D2 | Acción principal = `primary` del export vigente (hoy `#734863`, malva). |
| D3 | Fondo = `surface` del export vigente (hoy `#FDF8F7`), no `#FFFFFF`. |
| D5 | Errores con los roles `error` del export, más icono y texto. |
| D8 | Tipografía Roboto, la base de M3. |
| O1 | Ancho de referencia de 412 dp. |
| O2 | «Mi perfil», sin mayúscula interior. |
| C1 | «Volver» como `IconButton` `arrow_back`; el texto queda como nombre accesible. |
| C2 | Tipo de mascota como tarjeta seleccionable con ilustración en círculo. |
| C3 | Filtros como chips: «Necesidades especiales» conmutable y «Ubicación» con menú. |
| C4 | Datos de la ficha y respuestas del perfil como lista dato–valor apilada. |
| C5 | Campos con etiqueta M3 flotante, siempre visible. |
| C7 | Icono de diálogo de 24 px. |
| C8 | Botón S relleno en la tarjeta de mascota: «Ver compatibilidad» sin test y «Más información» con test. |
| C9 | Acciones de diálogo como botones de texto alineados al final. |
| U2 | La ficha muestra el porcentaje y los motivos (TestResults). |
| U4 | Cancelar la solicitud pide confirmación. |
| ~~U6~~ | ~~«Proceso» usa `pets`, no el corazón.~~ Sustituida por la NAV1. |
| UX1 (13/11) | Botón tonal S en la tarjeta de mascota; el relleno queda para la acción principal (resuelve la U7). |
| UX2 (13/11) | Morph de forma al seleccionar: tarjeta de tipo 12 → 20, chip 8 → 12. |
| UX3 (13/11) | Formas Expressive detrás de los iconos de estado vacío y de los números del proceso. |
| UX4 (13/11) | Iconos Material Symbols Rounded, con relleno animado en la pestaña activa. |
| UX5 (13/11) | Barra superior con tono según scroll; barra de acciones sin borde, en `surface-container`. |
| UX6 (13/11) | Indicador de carga Expressive en el botón al enviar la solicitud (cubre la E1 en ese punto). |
| U1 (13/11) | Los anillos de Inicio se mantienen con porcentajes. |
| COL2 (17/11) | **Sustituye a la COL1.** Paleta con el malva como primary (export del 17/11, 09:35). Malva para marca, acción y compatibilidad; cabeceras en `primary-container`; selección tonal en `secondary-container` / `on-secondary-container`; anillos de Inicio y pasos pendientes con color; huecos de foto en `tertiary-container`. 5 roles del Claro sustituidos por los tonos 90/30 de M3 (ver Color). Solo cambian roles de color: ni formas, ni medidas, ni tipografía, ni iconos, ni textos. |
| ~~COL1 (17/11)~~ | ~~Paleta «material-theme-pinky-pet-AA» con azul verdoso como primary y malva solo para compatibilidad y logotipo.~~ Sustituida por la COL2. |
| UX10 (15/11) | Inicio: vuelve la barra superior con el logotipo (círculo + «Pinky Pet»), igual que el resto de pantallas raíz, y el buscador baja justo debajo a ancho completo, sin icono de cuenta. Mi hogar pasa a `chair` (`living` dibujaba el sofá dentro de un recuadro). |
| UX9 (15/11) | Inicio: las formas de la cabecera se separan 12 px (antes se solapaban); los iconos de los bloques del test pasan a `living`, `schedule` y `pet_supplies` para no confundirse con los de la barra de navegación. |
| UX8 (13/11) | Rediseño de Inicio: barra superior con búsqueda (*search app bar*); cabecera según la situación con ilustraciones grandes sobre formas Expressive y titular display (HomeHero); carrusel de mascotas con porcentaje si hay test (Carousel, disposición sin contener); anillos en tarjeta de 88 px con icono de bloque, manteniendo el porcentaje; «Qué significa el resultado» como nota con icono. |
| UX11 (17/11) | Rediseño de la Ficha: foto protagonista de 280 px en arena con la píldora «92 % compatible» (AnimalHeader); nombre a escala display; ubicación con `location_on`; especie, sexo, edad y tamaño en 4 casillas (FactTiles) en vez de una línea con « · »; «Resultados de tu test» sube justo después de la cabecera, con barras por bloque y los motivos sobre formas Expressive; la información general se divide en «Salud y cuidados» y «Carácter y convivencia» (InfoGroup). Mismos datos y textos; la barra de acciones no cambia. |
| BR1 (17/11) | Imagotipo de marca: sello `primary` con la «p»-huella en negativo + «Pinky Pet» en Fraunces 900 `primary`. Sustituye al círculo liso de la barra superior. Resuelve la U9: el sello es el logo, decorativo, no un acceso. |
| ILU2 (17/11) | El círculo de las tarjetas de tipo sin seleccionar pasa de `surface-container-highest` (#E6E2E0) a `surface-container-low` (#F7F3F1): las ilustraciones ganan contraste (oreja del perro 2,46 → 2,87:1) y el círculo se sigue distinguiendo de la tarjeta blanca. Seleccionada, sigue en `surface-container-lowest` sobre `secondary-container`. |
| LOG1 (18/11) | «Continuar con Google» lleva la «G» oficial multicolor de Google (20 × 20, SVG en `pp-btn__logo`), en lugar del hueco gris. No se recolorea ni se deforma (norma de marca de Google). El botón sigue siendo outlined con texto Roboto 500. En el lienzo se aplica en Login y Registro. |
| ICO2 (18/11) | Corrección de la ICO1, que no bastó: en las vistas previas de la biblioteca los iconos seguían saliendo como texto. Causa probable (no verificada): el marco de cada ejemplo no aplica el `<link>` de Google Fonts del `<head>` ni el `@import` de `bundle.css` (queda detrás de `tokens.css`). Cada ejemplo carga ahora la fuente desde un pequeño script al final. No lo he podido comprobar con la fuente real (mi entorno no llega a Google Fonts): si siguen viéndose como texto, el siguiente paso es incluir la fuente como archivo en `tokens.json`. |
| ACC1 (18/11) | **Texto grande:** los controles con texto pasan de alto fijo a **alto mínimo** (mismo aspecto a tamaño normal) y la barra de navegación muestra solo la etiqueta activa cuando no caben las 4 (`pp-navbar--label-activa`, patrón de M3). Sale de la prueba con el texto al 200 % en 6 pantallas del lienzo. Ver «Texto grande» en Espaciado, layout y accesibilidad. |
| MOV1 (18/11) | **Animación de primer inicio:** solo la primera vez que se abre la app, sobre «Inicio · sin cuenta». Se adapta el documento de partida: medidas a 412 × 917, huella oficial en vez de un dibujo nuevo, curvas de M3 en vez de `(.25, .8, .25, 1)` y `(.4, 0, .2, 1)`, opacidad máxima de las huellas 0,5 / 0,7 (no 0,9), movimiento reducido sin nada de animación y el componente se quita al terminar. Es una transición después de la pantalla de arranque del sistema, no la sustituye. Componentes `Huella` y `SplashPrimerInicio`. |
| OSC1 (18/11) | Se valida el esquema **Oscuro**: 7 roles pasan a la asignación estándar de M3 (contenedor tono 30, contenido tono 90, `tertiary` tono 80), ver «Esquema Oscuro». Textos sobre contenedores de 4,5:1 a 7,2:1 y la arena deja de deslumbrar (de 14,3:1 a 2,0:1 frente al fondo). Para comprobarlo, el lienzo de alta fidelidad tiene 6 pantallas duplicadas en oscuro (fila «Modo oscuro»). Resuelve la parte oscura de la D7. |
| FOTO1 (18/11) | Las 6 fotos provisionales (simulación académica) se guardan también en la biblioteca: grupo de recursos **Fotos** (`coco`, `kira`, `luna`, `nube`, `rocky`, `simba`) y se usan en los ejemplos de `AnimalCard` (Luna, Simba), `AnimalHeader` (Luna) y `Carousel` (las 6). Los huecos sin foto siguen documentados en `MediaPlaceholder`. |
| UX16 (18/11) | La foto de la tarjeta de mascota pasa de 152 × 96 (con 16 px de relleno alrededor) a **184 × 128 a sangre**: ocupa todo el ancho de la tarjeta, arriba, con las esquinas superiores de la tarjeta (11 px). El texto de debajo conserva su relleno de 16 px, así que no se mueve el alineado. M3 usa el contenido multimedia de una tarjeta a sangre. La tarjeta crece 32 px de alto. Modifica la UX15. |
| UX15 (18/11) | Se fija la especificación de las fotos de mascotas (sección «Fotos de mascotas»): 3 huecos (380 × 280, 152 × 96 y 160 × 200), un maestro 4:3 de al menos 1600 × 1200 con la mascota en el centro, y nombres de archivo por mascota para sustituirlas sin tocar pantallas. Se añade `.pp-carousel__item img` (faltaba) y `object-position: 50% 30%` en los tres. Las fotos de esta etapa son **simulación académica** (6 imágenes aportadas por la autora, recortadas a 4:3): Nube = cobaya, Coco = conejo, Luna y Simba = gatos, Rocky y Kira = perros. Aviso: Kira consta con 8 años y la perra de la foto parece joven; Rocky consta como «Grande» y el perro de la foto parece de talla grande. |
| UX14 (18/11) | **Prueba:** las 4 casillas de `FactTiles` pasan de `surface-container` a `tertiary-container` (arena), con texto `on-tertiary-container` (7,97:1). Motivo: con fotos reales el hueco de foto deja de verse y la arena quedaba solo en el Consejo del experto. La arena se diferencia poco del fondo (1,11:1), así que funciona como tinte, no como contorno; los datos no dependen del color. Amplía la regla de la arena. Hay que valorarla con una foto real y revertir si resta jerarquía a la foto. |
| ICO1 (18/11) | Corrección de un fallo: los iconos se veían como texto («check_circle») porque `.pp-icon` tomaba la familia de la variable `--font-icon`, que no llegaba a resolverse. Ahora `.pp-icon` declara literalmente `'Material Symbols Rounded'`. Requiere conexión a Google Fonts; sin ella el navegador muestra el nombre del icono. |
| TXT2 (18/11) | Etiqueta del botón que lleva al test (solo aparece sin test hecho), en una sola línea y sin agrandar el botón: **«Descubrir mi compatibilidad»** en los botones anchos de 56 px (Inicio, Mascotas, Cómo adoptar, Mi perfil) y **«Ver compatibilidad»** en la tarjeta de mascota. En la tarjeta el texto dispone de 120 px (186 de tarjeta − 32 de relleno − 2 de borde − 32 de relleno del botón): «Ver compatibilidad» mide 107 px; «Ver mi compatibilidad» mide 125 y no cabe. El nombre accesible contiene el texto visible (WCAG 2.5.3). Hipótesis aún sin probar con personas. Modifica la TXT1. |
| TXT1 (17/11) | Lenguaje: «animal» pasa a «mascota» en todos los textos (con su concordancia: «la mascota», «otras mascotas», «Ver la ficha de la mascota»); el título de la pantalla «Catálogo» pasa a «Mascotas», igual que la pestaña; y los botones «Hacer Test» y «Hacer el test de compatibilidad» dejan de usar «test» (etiquetas finales en la TXT2). Los nombres de componentes (`AnimalCard`, `AnimalHeader`) y de clases no cambian. El botón «Crear cuenta y hacer el test» no se toca: es otra acción. |
| NAV1 (17/11) | La pestaña «Proceso» pasa de `pets` a `hourglass_empty` (reloj de arena): deja de repetir la huella del logotipo y de la ilustración de «Otros», y dice «proceso en curso». `pets` queda libre y solo se usa en el estado vacío «sin compatibles». |
| ILU3 (17/11) | «Otros» deja la ilustración de huella con corazón y usa el isotipo de la marca (`pp-mark`, CSS) a 40 px en el círculo claro. Se elimina `otros.png` de los assets. Cumple la COL3: el malva va sobre el círculo claro, nunca sobre el verde. Modifica la ILU1. |
| ILU1 (17/11) | Nuevas ilustraciones planas de gato, perro y huella con corazón (Otros), con fondo transparente. «Otros» deja de usar el icono `pets`, que se confundía con la pestaña Proceso. Mismas medidas: 44 px en el selector, 56/44 en Inicio y 32 en Cómo adoptar. La de «Otros» se sustituyó después por el isotipo (ILU3). |
| TYP1 (17/11) | Fraunces para títulos y encabezados (display, headline y title-large) y Roboto para el resto, como los tokens *brand* y *plain* de M3. Las cifras siguen en Roboto. Sin cambios de tamaño, interlineado, espaciado ni padding. |
| UX13 (18/11) | El test pasa de 1 a **3 Consejos del experto, uno por bloque**: pregunta 3 (acuerdo del hogar), 6 (tiempo solo, la que ya existía) y 14 (gasto mensual). Reglas: máximo uno por bloque, unos 200 caracteres como mucho y sin cifras sin verificar. Los textos nuevos son provisionales (simulación académica) y hay que validarlos con una persona experta. Amplía la UX12. |
| UX12 (17/11) | «Consejo del experto» deja de ser una `Card` outlined (se confundía con las preguntas) y pasa a `ExpertTip`: relleno en arena, `corner-large`, forma Expressive sunny con `lightbulb` y antetítulo «Sobre la pregunta {n}» que lo ata a su pregunta. |
| COL3 (17/11) | El malva y el verde nunca se superponen: el check de la tarjeta de tipo seleccionada pasa de `primary` a `on-secondary-container`. |
| UX7 (13/11) | Rediseño de Cómo adoptar: cabecera según la situación del usuario (ProcessHero), pasos con progreso y forma Expressive propia con una línea de explicación (ProcessSteps), y requisitos como checklist (Checklist). «Mi solicitud» solo aparece abajo si no hay una solicitud en proceso. |

## Pendiente de decidir

**Discrepancias abiertas**
- **D6:** no hay color de éxito; es neutro + icono, y ni el malva ni el azul verdoso pueden usarse para éxito. ¿Hace falta un color extendido?
- **D7:** contraste medio y alto. Están en los tokens sin revisar (Claro y Oscuro ya validados, OSC1). ¿Entran en el alcance?
- **D9:** el tono 99 de neutral y neutral-variant en el export es `#F6FEFF`, un tinte cian fuera de la serie. Ningún rol lo usa; revisarlo si se regenera el tema.
- **O3:** el idioma. La guía del curso pide catalán y el brief, castellano. Consultar con el docente.

**Usabilidad**
- **U3:** el diálogo «Solicitud enviada» se abre sobre Estado y su botón lleva a la misma pantalla. Alternativa: un snackbar.
- **U5:** la navigation bar sigue visible durante el test. ¿Se pierden las respuestas al cambiar de pestaña?
- **U8:** en Mi perfil sin cuenta, «Descubrir mi compatibilidad» lleva a Registro.
- **U10:** Login y Registro con error pierden «Continuar con Google».

**Estados y piezas que faltan en el wireframe**
- **E1:** estados de carga de la lista de mascotas, del inicio de sesión y del registro (el envío de la solicitud ya lo tiene).
- **E2:** resultados de búsqueda.
- **E4:** progreso del test (solo hay texto «12 de 15»).
- **E5:** mostrar u ocultar la contraseña, y «He olvidado mi contraseña».
- **E6:** foto cargando o sin foto.
- **E7:** la zona fija más la navigation bar suman unos 220 dp.

**Mejoras Expressive propuestas, sin aplicar**
- Menú con esquinas de 16 y opción marcada redondeada.
