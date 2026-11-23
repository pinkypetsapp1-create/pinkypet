# EmptyState
Mensaje centrado cuando no hay contenido o falla la carga.

## Anatomía
Icono de 48 px en `on-surface-variant` sobre una **forma de la librería Expressive** de 96 px en `surface-container-highest` (`pp-shape pp-shape--96`, ver Shapes), título en `headline-small`, uno o dos párrafos en `body-medium` con `on-surface-variant` y botón relleno M a ancho completo. Va a 48 px del título de pantalla.

## Casos del wireframe
| Icono | Forma | Título | Acción | Rol |
|---|---|---|---|---|
| `search_off` | cookie-4 | No hay mascotas con estos filtros | Quitar filtros | — |
| `wifi_off` | soft-burst | No hemos podido cargar las mascotas | Reintentar | `alert` |
| `pets` | cookie-9 | Todavía no hay mascotas compatibles contigo | Revisar mis respuestas | `status` |
| `assignment` | sunny | Todavía no has enviado ninguna solicitud de adopción. | Buscar mascotas | — |

## Tokens
`on-surface-variant`, `on-surface`, `primary`, `space-3`, `space-6`, `space-12`.

## Fuente
Wireframe de fidelidad media: Mascotas sin resultados, Error de Mascotas, Sin compatibles, Sin solicitud.
