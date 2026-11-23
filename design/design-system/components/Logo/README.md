# Logo
Marca de Pinky Pet (BR1): una **«p» hecha con una huella** (cuatro almohadillas + la almohadilla grande como panza de la «p» y un trazo vertical como asta). Une las dos ideas de la app: la mascota y el nombre.

## Piezas
| Pieza | Archivo (grupo de assets *Logotipo*) | Uso |
|---|---|---|
| **Imagotipo** | sello + «Pinky Pet» | Barra superior de las pantallas raíz (`TopAppBar` de marca), portada |
| **Isotipo** (principal) | `isotipo.svg`: círculo `primary` con la huella en `on-primary` | Icono de la app, avatar, favicon, sello de la barra |
| **Isotipo invertido** | `isotipo-invertido.svg`: círculo blanco con la huella en `primary` | Sobre fondos malva (`primary`) o fotos oscuras |
| **Isotipo a una tinta** | `isotipo-una-tinta.svg`: círculo `on-surface` con la huella en blanco | Impresión en blanco y negro, sellos, documentos |
| **Huella «p»** | `huella-p.svg`: la huella sola en `primary` | Marca de agua, detalles gráficos grandes. No a menos de 24 px |

## Imagotipo
- **Sello** de 32 px (`pp-topbar__mark` o `pp-mark`): círculo en `primary` y la huella en `on-primary` mediante máscara CSS, así cambia de color con el tema.
- **Logotipo** (`pp-topbar__title` en la barra de marca, o `pp-logotype`): «Pinky Pet» en **Fraunces 900**, tamaño óptico automático, SOFT 50, WONK 0, tracking −0,5 px, en `primary`.
- Separación entre sello y texto: 12 px.

## Contraste
- Huella `on-primary` sobre `primary`: 7,40:1.
- Logotipo `primary` sobre `surface`: 7,03:1; sobre `surface-container` (barra con scroll): 6,37:1.
- A una tinta: 17,19:1.

## Reglas
- No recolorear la huella con otros roles; no poner el isotipo principal sobre `primary` (usa el invertido) ni sobre verde (`secondary-container`), por la regla COL3.
- Tamaño mínimo del isotipo: 24 px. Área de respeto: un cuarto de su diámetro alrededor.
- También representa a «Otros» en el selector de tipo (`SelectableCard`), a 40 px dentro del círculo claro: allí va sin el nombre y es decorativo, porque la etiqueta «Otros» ya nombra la opción.
- El sello es decorativo (`aria-hidden`) cuando va junto al nombre; solo, como icono, lleva `aria-label="Pinky Pet"`.

## Tokens
`primary`, `on-primary`, `on-surface`, `surface`, `surface-container`.

## Fuente
Wireframe de fidelidad media: barra superior de las pantallas raíz.
