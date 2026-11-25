# Button
Botón en píldora que se cuadra al pulsar (morph de forma de M3 Expressive): M pasa a `corner-medium` (12) y S a `corner-small` (8).

## Variantes del wireframe
| Variante | Clase | Textos del wireframe |
|---|---|---|
| Relleno M | `pp-btn pp-btn--filled pp-btn--block` | «Descubrir mi compatibilidad», «Enviar solicitud de adopción», «Ver el estado de mi solicitud», «Iniciar sesión», «Crear cuenta y hacer el test», «Ver mis mascotas compatibles», «Quitar filtros», «Reintentar», «Revisar mis respuestas», «Volver a mis mascotas compatibles», «Enviar enlace» y «Volver a iniciar sesión» (Recuperar contraseña), «Guardar contraseña» y «Pedir un enlace nuevo» (Nueva contraseña) |
| Tonal S | `pp-btn pp-btn--tonal pp-btn--s` | «Ver compatibilidad», «Más información» (tarjeta de mascota): acción repetida en la rejilla, por debajo del único relleno de la pantalla |
| Outlined M | `pp-btn pp-btn--outlined pp-btn--block` | «Seguir mirando otras mascotas», «Ver la ficha de la mascota», «Modificar mis respuestas», «Ver el estado de mi solicitud» (Cómo adoptar) |
| Outlined M con logo | `+ pp-btn__logo` | «Continuar con Google» (logotipo «G» oficial de Google, multicolor, 20 × 20; no se recolorea) |
| Outlined S | `pp-btn pp-btn--outlined pp-btn--s` | «Iniciar sesión con este correo» (dentro del aviso de error) |
| Texto | `pp-btn pp-btn--text` | Acciones de diálogo: «Sí, enviar solicitud», «Cancelar», «Reintentar el envío»…; «¿Has olvidado tu contraseña?» bajo el campo Contraseña de Iniciar sesión, alineado con el texto (margen izquierdo −12) |
| Texto con icono | `pp-btn pp-btn--text pp-btn--lead` | `person_add` «Regístrate», `login` «Inicia sesión», `logout` «Cerrar sesión» (tarjeta «Mi cuenta» de Mi perfil), `close` «Cancelar solicitud», `filter_alt_off` «Quitar filtros» |

## Reglas
**Nunca se encoge** (`flex-shrink: 0`): mantiene sus 56 o 40 px aunque esté dentro de un contenedor con scroll, que es el que debe desplazarse. **Alto mínimo, no fijo (ACC1):** 56 / 40 / 48 px son mínimos con 8 px de relleno vertical; con el tamaño de letra del sistema grande, el texto pasa a dos líneas y el botón crece hacia abajo en vez de desbordarse. A tamaño normal se ve igual. Una acción rellena por pantalla; las acciones repetidas (una por tarjeta) van en tonal. El tonal usa `secondary-container` con texto `on-secondary-container` (7,27:1), como indica M3.

## Estado de carga (Expressive)
`pp-btn--loading`: el texto se sustituye por el **indicador de carga de M3 Expressive** (forma que muta cookie-4 → soft-burst → cookie-9 → sunny y gira, 2,8 s por ciclo) de 24 px en el color del texto del botón. El botón conserva ancho y alto, no se puede pulsar y anuncia «Enviando solicitud…» con `aria-live="polite"`. En el wireframe: «Enviar solicitud de adopción» tras confirmar el diálogo, y «Reintentar el envío». Los botones S y de texto quedan dentro de un área de 48 px (`pp-target`). Usa `<a>` para navegar y `<button>` para acciones; añade `pp-state` para hover y pulsado.

## Tokens
`primary`, `on-primary`, `secondary-container`, `on-surface`, `outline-variant`, `outline`, `surface-container-highest`, `corner-full`, `corner-medium`, `corner-small`, `state-hover`, `state-pressed`.

## Fuente
Wireframe de fidelidad media: todas las pantallas.
