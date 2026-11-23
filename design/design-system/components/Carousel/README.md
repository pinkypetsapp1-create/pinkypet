# Carousel
Carrusel horizontal de mascotas en Inicio, con la disposición **sin contener** (*uncontained*) del carrusel de M3 Expressive: tarjetas del mismo tamaño que asoman por el borde derecho y encajan al deslizar (*scroll snap*).

## Anatomía
- **Cabecera:** título de sección en `title-large` (Fraunces) y, a la derecha, el botón de texto «Ver todos».
- **Tarjetas:** 160 × 200 px, esquinas `corner-extra-large` (28) que pasan a `corner-large` al pulsar, 8 px de hueco. Sangran hasta el borde de la pantalla.
- **Dentro de cada tarjeta:** la foto (por ahora un hueco en `tertiary-container`, arena, con icono y texto en `on-tertiary-container`), una insignia con el porcentaje arriba a la izquierda (solo con el test hecho; texto `primary` sobre `surface-container-lowest`, 7,40:1) y una píldora con el nombre abajo (`on-surface` sobre `surface-container-lowest`).

## Variantes
| Situación | Título | Orden | Porcentaje | Destino |
|---|---|---|---|---|
| Sin test | Buscan hogar | El de Mascotas | No | Mascotas |
| Con test | Los que más encajan contigo | De mayor a menor compatibilidad | Sí | Ficha de la mascota |

## Por qué «sin contener» y no *multi-browse*
El *multi-browse* cambia el tamaño de las tarjetas durante el scroll, y eso no se puede reproducir en el prototipo estático. Si la app se desarrolla con el componente nativo de Material, se puede pasar a *multi-browse* sin cambiar el contenido.

## Accesibilidad
`<ul aria-label>` con un enlace por tarjeta y `aria-label` completo («Luna, 92 % compatible. Ver su ficha»); las píldoras van con `aria-hidden`.

## Tokens
`tertiary-container`, `on-tertiary-container`, `surface-container-lowest`, `primary`, `on-surface`, `corner-extra-large`, `corner-large`, `corner-full`.

## Fuente
Wireframe de fidelidad media: Inicio.
