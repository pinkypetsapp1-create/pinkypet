# Mapa diseño → código

Sirve para saber qué código toca cada cambio del diseño. Se actualiza en cada `/sincronizar-diseno`.
Versiones: DS `1795433635-941c` · AF `1795433636-1cea`. Las rutas y los componentes son **propuestas** hasta la Fase 2: la columna «Estado» dice si ya existen.

## 1. Componentes del Design System → componentes de código

Todos son componentes Angular *standalone* en `app/src/app/ui/`, que pintan las clases `pp-` de `bundle.css`. Sus README están en `design/design-system/components/<Nombre>/`.

| Componente DS | Clases principales | Componente de código (propuesto) | Estado |
|---|---|---|---|
| AccountPrompt | `pp-prompt` | `pp-account-prompt` | pendiente F2 |
| ActiveFilters | `pp-active-filters`, `pp-count` | `pp-active-filters` | pendiente F2 |
| AnimalCard | `pp-animal-card` | `pp-animal-card` | pendiente F2 |
| AnimalHeader | `pp-animal-hero` | `pp-animal-header` | pendiente F2 |
| Banner | `pp-banner` | `pp-banner` | pendiente F2 |
| BottomActionBar | `pp-action-bar` | `pp-bottom-action-bar` | pendiente F2 |
| Button | `pp-btn` | directiva `ppButton` sobre `<button>`/`<a>` | pendiente F2 |
| Card | `pp-card` | `pp-card` | pendiente F2 |
| Carousel | `pp-carousel` | `pp-carousel` | pendiente F2 |
| Checklist | `pp-checklist` | `pp-checklist` | pendiente F2 |
| CompatibilityMeter | `pp-meter`, `pp-progress` | `pp-compatibility-meter` | pendiente F2 |
| Cover | — | (solo es la portada del DS; no va a la app) | no aplica |
| Dialog | `pp-dialog` | `pp-dialog` (con `ion-modal` estilizado o `<dialog>`) | pendiente F2 |
| Divider | `pp-divider` | `pp-divider` | pendiente F2 |
| EmptyState | `pp-empty` | `pp-empty-state` | pendiente F2 |
| ExpertTip | `pp-tip` | `pp-expert-tip` | pendiente F2 |
| FactTiles | `pp-facts` | `pp-fact-tiles` | pendiente F2 |
| FilterChip | `pp-chip` | `pp-filter-chip` | pendiente F2 |
| HomeHero | `pp-hero` | `pp-home-hero` | pendiente F2 |
| Huella | `pp-paw` | `pp-huella` | pendiente F2 |
| IconButton | `pp-icon-btn` | `pp-icon-button` | pendiente F2 |
| InfoGroup | `pp-info-group`, `pp-list` | `pp-info-group` | pendiente F2 |
| List | `pp-list` | `pp-list` | pendiente F2 |
| Logo | `pp-mark`, `pp-topbar__mark` | `pp-logo` | pendiente F2 |
| MediaPlaceholder | `pp-media` | `pp-media` | pendiente F2 |
| Menu | `pp-menu` | `pp-menu` | pendiente F2 |
| NavigationBar | `pp-navbar` | `pp-navigation-bar` (dentro de `ion-tabs`) | pendiente F2 |
| ProcessHero | `pp-hero` | `pp-process-hero` | pendiente F2 |
| ProcessSteps | `pp-psteps`, `pp-pstep` | `pp-process-steps` | pendiente F2 |
| ProgressRing | `pp-ring` | `pp-progress-ring` | pendiente F2 |
| Question | `pp-question` | `pp-question` | pendiente F2 |
| SearchBar | `pp-search` | `pp-search-bar` | pendiente F2 |
| SelectableCard | `pp-select-card` | `pp-selectable-card` | pendiente F2 |
| Shapes | `pp-shape` | `pp-shape` | pendiente F2 |
| SplashPrimerInicio | `pp-splash` | `pp-splash` | pendiente F2 |
| StatusCard | `pp-status-card`, `pp-status` | `pp-status-card` | pendiente F2 |
| Stepper | `pp-steps`, `pp-step` | `pp-stepper` | pendiente F2 |
| Tag | `pp-tag` | `pp-tag` | pendiente F2 |
| TestResults | `pp-results`, `pp-block-bar`, `pp-insight` | `pp-test-results` | pendiente F2 |
| TextField | `pp-field` | `pp-text-field` | pendiente F2 |
| TextPatterns | — | (patrones de texto; se aplican en las pantallas) | no aplica |
| TopAppBar | `pp-topbar` | `pp-top-app-bar` | pendiente F2 |

> Las clases de la segunda columna están comprobadas contra `bundle.css` y las previews. Antes de crear cada componente, lee su README entero.

Tokens: `design/design-system/tokens.json` → `npm run tokens` → `app/src/theme/tokens.css` (generado).

## 2. Pantallas (boards de `canvas.json`) → rutas

Estados de usuario: **I** = sin cuenta (invitado) · **R** = registrado sin test · **T** = con test, sin solicitud · **S** = con solicitud en proceso.

Las variantes «Oscuro…», «…Texto», «Texto-…», «…Zoom» y «Zoom-…» **no son rutas**: son la misma pantalla en tema oscuro, con texto al 200 % o a 206 px de ancho (ver `docs/SPEC.md` §3). Los boards «Componente · …» (`TabBar`, `Ficha`, `Estado`) son las bases que reutilizan las demás pantallas.

| Ruta (propuesta) | Boards | Estado de usuario | Datos que muestra |
|---|---|---|---|
| (primer arranque) | `PrimerInicio`, `PrimerInicioOscuro` | I | Animación de marca sobre Inicio; solo la primera vez y sin movimiento reducido |
| `/inicio` | `Main` (I), `Inicio-Registrado` (R), `Inicio-Sesion` (T/S) | I · R · T · S | Carrusel «Buscan hogar» (sin %) o «Los que más encajan contigo» (con %); tarjeta del test |
| `/registro` | `Registro`, `Error-Registro-Campos`, `Error-Registro-Existe` | I | Formulario de correo y contraseña; errores `VALIDATION_FAILED` y `EMAIL_ALREADY_REGISTERED` |
| `/login` | `Login`, `Error-Login` | I | Formulario; error `AUTH_INVALID_CREDENTIALS` |
| `/test` | `Test` (R, vacío), `Test-Error`, `Test-Completado` (T, con respuestas) | R · T · S | 15 preguntas en 3 bloques y consejos del experto; respuestas guardadas |
| `/mascotas` | `Catalogo` (I), `Catalogo-Registrado` (R), `Compatibles` (T), `Compatibles-Limite-<Mascota>` (S), `Error-Catalogo`, `Error-SinCompatibles` | I · R · T · S | Lista de mascotas con filtros; con test, % y motivo, ordenada |
| `/mascotas/:id` | `Ficha-<Mascota>` (T), `Ficha-<Mascota>-Enviada` (S, la propia), `Ficha-Limite` (S, otra), `Error-Envio` | T · S | Ficha completa, % por bloques, diálogos de envío, de límite y de error |
| `/proceso` | `ComoAdoptar` (I), `ComoAdoptar-Registrado` (R), `ComoAdoptar-Sesion` (T), `ComoAdoptar-Sesion-<Mascota>` (S) | I · R · T · S | Pasos y requisitos para adoptar; acceso al estado |
| `/proceso/solicitud` | `SinSolicitud` (I/R), `SinSolicitud-Sesion` (T), `MiSolicitud` y `Solicitud-<Mascota>` (S), `Estado-<Mascota>` (S, con el aviso «Solicitud enviada»), `Estado-Finalizada`, `Estado-NoDisponible`, `Error-Cancelar` | I · R · T · S | Estado de la solicitud activa (en proceso, finalizada, no disponible o cancelada) |
| `/perfil` | `PerfilVacio` (I), `PerfilVacio-Registrado` (R), `PerfilCompletado` (T/S) | I · R · T · S | Correo y respuestas del test |

Pestañas (`TabBar`): Inicio · Mascotas · Proceso · Mi perfil, con los iconos `home` · `search` · `hourglass_empty` · `person`. No aparecen en Registro ni en Login.
