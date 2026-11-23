# Pinky Pet · Instrucciones iniciales para Claude Code

> **Uso (para nosotras/os, no para Claude):** guarda este archivo como `docs/PROMPT-INICIAL.md` en la carpeta vacía del proyecto (con `git init` hecho), arranca Claude Code en modo plan con `claude --permission-mode plan` y escribe:
> `Lee @docs/PROMPT-INICIAL.md y empieza por la Fase 0.`

---

## 0. Contexto y forma de trabajar

- **Qué es:** Pinky Pet es un proyecto académico de una clase de UX/UI (no es un producto comercial). Es una app móvil Android (lienzo de 412 × 917 dp) que ayuda a valorar la compatibilidad entre una persona y una mascota antes de adoptarla. El diseño está terminado en Claude Design. Ahora hay que convertirlo en una app que funcione, con registro, inicio de sesión, autenticación y datos mock.
- **Quiénes somos:** estudiantes de diseño. Explica cada decisión técnica en español claro y en pocas líneas.
- **Por fases.** En cada fase sigue este orden: plan → mi aprobación → implementación → verificación con algo que puedas ejecutar (tests, build, capturas) → me enseñas la evidencia → commit → **PARAS** hasta que apruebe la siguiente.
- **No inventes requisitos.** Si algo no está en este documento ni en el diseño, pregúntame con AskUserQuestion o anótalo en «Decisiones pendientes» de `docs/SPEC.md`.
- **Secretos:** nunca en el repositorio ni en el chat. `.env` va en `.gitignore`, y `.env.example` lleva las claves vacías.
- **Textos:** la interfaz va en castellano, con los textos literales del diseño y el tono del README del Design System.

## 1. Fuentes del diseño y orden de prioridad

| Fuente | URL | Versión de partida | Qué manda |
|---|---|---|---|
| Design System «Pinky Pet · Design System M3 Expressive» | https://claude.ai/artifact/FdYKiHu4B9TE7YT6tG8ErF | `1795026228-d284` | Lo visual: tokens, componentes (clases `pp-`), reglas de color, tipografía, forma y movimiento, iconos y assets (logotipo, ilustraciones y fotos) |
| Design «Pinky Pet · Alta fidelidad» | https://claude.ai/artifact/1MwUAQpwJFExpLby6g9vH2 | `1795162665-6a50` | Pantallas, estados, flujos (las notas «CONEXIONES»), datos de ejemplo y textos literales |

- **Orden de prioridad:**
  1. El Design System, para todo lo visual.
  2. Alta fidelidad, para pantallas, estados, textos y flujos.
  3. Este documento, para backend, datos y reglas que el diseño no cubre.
- **No uses** «Pinky Pet · Fidelidad media» ni ningún otro artifact: están congelados como histórico del proceso.
- **Aviso:** el README del Design System todavía dice «Fuente de verdad: el wireframe de fidelidad media». Esa línea está desactualizada; la decisión vigente es la del orden de prioridad anterior.
- **Regla del equipo:** todo cambio se hace primero en el Design System, después en Alta fidelidad y, por último, en el código. El código nunca origina un cambio de diseño.

## 2. Fase 0 · Conectar con el diseño y montar la sincronización

Objetivo: tener una copia versionada del diseño dentro del repositorio y un procedimiento repetible para traer los cambios.

### 2.1 Acceso
Prueba estas vías en orden y dime cuál funciona:
1. Leer los dos artifacts por su URL. Si necesitas que los adjunte yo con `/artifacts`, dímelo. Comprueba que puedes leer los archivos internos y su versión:
   - del Design System: `README.md`, `tokens.json`, `design-system.json`, `components/bundle.css`, `components/*/README.md` y los assets;
   - de Alta fidelidad: `canvas.json` y todos los `*.dc.html`.
2. Si no puedes, pídeme el handoff. En Alta fidelidad haré **Export → Handoff to Claude Code → Send to local coding agent** y pegaré aquí el comando.
3. Último recurso: exporto un ZIP de cada artifact y lo dejo en `design/_incoming/`.

No sigas hasta tener acceso a los dos.

### 2.2 Copia del diseño en `design/`
```
design/
├─ design-system/    README.md · tokens.json · design-system.json · components/bundle.css
│                    components/<Componente>/README.md · assets/{Logotipo,Ilustraciones,Fotos}/
├─ alta-fidelidad/   canvas.json · *.dc.html
├─ reference/        capturas PNG de 412×917 de cada pantalla (si el handoff no las trae, pídemelas)
├─ design.lock.json  por artifact: url, versión, fecha de sincronización y sha256 de cada archivo
└─ CHANGELOG.md
```
`design/` es de solo lectura, salvo cuando ejecutes la skill de sincronización (2.4).

### 2.3 Coherencia entre los dos artifacts
Alta fidelidad lleva dentro una copia del Design System (en `canvas.json` → `designSystems`, con versión y `copiedAt`). Compara el sha256 de su `tokens.json` y su `bundle.css` con los del Design System. Si no coinciden, **avísame**: hay que alinearlos en Claude Design, no en el código.

### 2.4 Skill `/sincronizar-diseno`
Créala en `.claude/skills/sincronizar-diseno/SKILL.md` con `disable-model-invocation: true` (solo la lanzo yo). No la confundas con el comando integrado `/design-sync`, que no vamos a usar: sirve para llevar a Claude Design un design system que vive en el código, y aquí la fuente de verdad es el Design System de Claude Design.

Pasos de la skill:
1. Obtener la última versión de los dos artifacts por la vía que haya funcionado en 2.1.
2. Compararla con `design.lock.json`. Si no ha cambiado nada, decirlo y parar.
3. Repetir la comprobación de 2.3.
4. Clasificar los cambios: tokens · componentes (`bundle.css` o READMEs) · pantallas (`*.dc.html`, `canvas.json`) · textos · assets · pantallas nuevas o eliminadas.
5. Con `docs/design-map.md`, listar qué archivos de código se ven afectados. Presentar el plan y esperar mi aprobación.
6. Aplicar: actualizar `design/`, regenerar los tokens (`npm run tokens`), adaptar componentes y pantallas, y actualizar `docs/design-map.md`.
7. Verificar: tests, build y capturas comparadas con `design/reference/`.
8. Actualizar `design.lock.json` y `CHANGELOG.md`, y hacer commit con el mensaje «design: sync DS <versión> / AF <versión>».

Si un cambio de diseño contradice una regla de `docs/SPEC.md`, para y pregúntame.

### 2.5 `docs/design-map.md`
Dos tablas:
- componente del Design System → componente de código;
- pantalla (board de `canvas.json`) → ruta, estado de usuario y datos que muestra.

Se actualiza en cada sincronización. Es lo que permite saber qué código toca cada cambio del diseño.

### 2.6 Tokens generados, nunca escritos a mano
Crea un script (`npm run tokens`) que genere `app/src/theme/tokens.css` a partir de `design/design-system/tokens.json`:
- el esquema claro, en `:root`;
- el oscuro, en `[data-theme="dark"]`, que es el selector que ya usa `bundle.css`;
- los de contraste medio y alto, como clases opcionales.

Lleva la cabecera «ARCHIVO GENERADO · NO EDITAR». El código no puede contener ningún valor de color, forma, espaciado ni movimiento escrito a mano.

Ojo: la semilla `#8E607C` no es el valor del rol `primary` (en el tema claro es `#734863`). Es correcto, sale así del Material Theme Builder. No lo «corrijas».

### 2.7 CLAUDE.md y SPEC.md
- `CLAUDE.md`, corto: comandos, estructura del repositorio y las reglas de oro del apartado 10.
- `docs/SPEC.md`, largo: el resto de este documento, más lo que descubras en el diseño y las decisiones pendientes.

**Entregable de la Fase 0:** informe de qué vía de acceso funciona, la copia de `design/` con su lock, la skill, `docs/design-map.md` inicial, `CLAUDE.md` y `docs/SPEC.md`. Commit y PARA.

## 3. Cómo leer el diseño (ya analizado; compruébalo)

- **Formato de los archivos.** Los `*.dc.html` usan un runtime propio de Claude Design (`x-dc`, `dc-import`, `DCLogic`, `support.js`). Son una referencia visual y de comportamiento, no código para copiar. Reconstruye cada pantalla en Angular con las clases `pp-` de `bundle.css` y los tokens.
- **Instancias, no pantallas.** Muchos archivos son el mismo componente base con props distintas. Por ejemplo, `Ficha-Luna` es `<dc-import name="Ficha" animal="luna">`, y `Ficha-Limite` es `Ficha` con `limite` y `segunda="Luna"`. En código cada uno es una sola pantalla con datos distintos.
- **Los sufijos de accesibilidad son estados, no pantallas:**
  - «Oscuro»: tema oscuro.
  - «Texto 200 %»: tamaño de letra del sistema al 200 %.
  - «Zoom» o «a 206 px»: reflujo con zoom al 200 %.

  La app debe soportar los tres en todas las pantallas.
- **Estados de usuario que cambian la interfaz:** sin cuenta · registrado sin test · con test y sin solicitud · con solicitud en proceso. Los títulos de los boards de `canvas.json` los indican.
- **Flujos.** Las notas «CONEXIONES» (`canvas.json` → `notes`) describen la navegación. Úsalas para las rutas y los guards.
- **Datos de las mascotas.** Están en los objetos `D` y `FOTO` del script de `Ficha.dc.html`. Son seis: Luna, Simba, Rocky, Kira, Coco y Nube. De cada una hay:
  - nombre, y una línea con especie · sexo · edad · ubicación · tamaño;
  - si tiene necesidades especiales;
  - el % global y el % de cada bloque;
  - ocho campos de información;
  - los textos «encaja» y «cuenta»;
  - la foto y su texto alternativo.

  Las fotos están en el Design System (grupo de assets *Fotos*). Esta es la fuente de los datos mock.
- **Test.** El script de `Test.dc.html` tiene 15 preguntas en 3 bloques de 5 (Mi hogar · Mi día a día · La mascota que busco), con sus opciones literales y los consejos del experto.
- **Fórmula del % global (deducida del diseño).** `global = round(0,34 · hogar + 0,33 · día a día + 0,33 · mascota)`. Cuadra con las seis mascotas: por ejemplo, Luna 95/90/90 → 92 y Rocky 55/70/67 → 64.
- **Estados de la solicitud** (script de `Estado.dc.html`):
  - en proceso: Solicitud enviada ✓ → Esperando respuesta → Adopción finalizada;
  - finalizada;
  - no disponible;
  - cancelada.
- **Registro e inicio de sesión.** Se pide correo y contraseña (mínimo 8 caracteres). Los mensajes de error literales están en `Registro.dc.html` y `Login.dc.html`.
- **Usuaria/o de ejemplo.** `persona@ejemplo.com`, con las respuestas del test de `PerfilCompletado.dc.html`.
- **Las pantallas de error definen el contrato de la API:**
  - `Error-Login`: credenciales incorrectas.
  - `Error-Registro-Existe`: el correo ya está registrado.
  - `Error-Registro-Campos`: campos no válidos.
  - `Error-Catalogo`: sin conexión.
  - `Error-Envio`: no se ha podido enviar la solicitud.
  - `Error-Cancelar`: no se ha podido cancelar la solicitud.
  - `Error-SinCompatibles`: ninguna mascota compatible.
  - `Test-Error`: preguntas sin responder.

## 4. Producto y reglas de negocio

- **Sin cuenta:** puede ver Inicio, Mascotas (catálogo sin %), Cómo adoptar y Mi perfil vacío. «Ver compatibilidad» lleva a Registro.
- **Registrado sin test:** «Ver compatibilidad» lleva al Test.
- **Con test:**
  - ve el % de cada mascota y la lista de compatibles ordenada;
  - Mi perfil muestra sus respuestas;
  - «Modificar mis respuestas» vuelve a calcular la compatibilidad.
- **Enviar una solicitud** exige cuenta y test. Lo deducimos del diseño: confírmalo conmigo.
- **Una sola solicitud activa por persona.**
  - Si intenta enviar otra, aparece el diálogo de `Ficha-Limite` para cancelar la actual o seguir con ella.
  - El backend debe garantizarlo (por ejemplo, con un índice único parcial en Mongo); no basta con la interfaz.
- **Cancelar una solicitud** pide confirmación, y la mascota sigue disponible.
- **Respuesta de la protectora.** La app no tiene parte de protectora, así que el paso de «en proceso» a «finalizada» o «no disponible» se simula para la demo con un script o un endpoint que solo exista en desarrollo.
- **El % orienta, no decide** (texto del Design System). El algoritmo es una simulación académica: documéntalo en `docs/SPEC.md` y no lo presentes como validado.
- **Vocabulario:**
  - «mascota», nunca «animal»;
  - pestañas Inicio · Mascotas · Proceso · Mi perfil, con los iconos `home` · `search` · `hourglass_empty` · `person` (Material Symbols Rounded);
  - textos de los botones tal como aparecen en el diseño.
- **Primer inicio.** La animación de marca (componentes `Huella` y `SplashPrimerInicio`) solo aparece la primera vez que se abre la app, en tema claro y oscuro, y respeta `prefers-reduced-motion`.

## 5. Stack y arquitectura

```
pinky-pet/
├─ CLAUDE.md
├─ docs/      SPEC.md · design-map.md · design-feedback.md · PROMPT-INICIAL.md
├─ design/    copia del diseño (solo lectura)
├─ scripts/   generación de tokens, etc.
├─ backend/   NestJS + MongoDB (Mongoose)
└─ app/       Ionic + Angular (componentes standalone) + Capacitor · Android
```

- **Base:** Node LTS y TypeScript en modo estricto en las dos partes.
- **Contrato de la API:** se describe con OpenAPI (Swagger) generado desde Nest, y el cliente de la app se tipa a partir de él.
  - El backend no depende del frontend. Así, si Ionic no da un resultado aceptable, una app nativa puede sustituirlo sin tocar el backend.
- **Ionic se usa como estructura,** no como librería visual: router, navegación por pestañas, `ion-content` y Capacitor.
  - Lo visual sale de los componentes del Design System (clases `pp-`) y de los tokens.
  - No dejes ningún componente `ion-*` con su estilo «md» por defecto. Si usas `ion-modal` o `ion-toast`, estilízalos con tokens.
- **Fuentes:** Fraunces, Roboto y Material Symbols Rounded, empaquetadas dentro de la app. Todas tienen licencia abierta.

## 6. Backend (NestJS + MongoDB)

- **Módulos:** `auth`, `users`, `pets`, `compatibility` (test y cálculo), `adoption-requests` y `health`.
- **Errores:**
  - Validación con class-validator.
  - Cada error lleva un código estable que la app traduce a los textos del diseño. Por ejemplo: `AUTH_INVALID_CREDENTIALS`, `EMAIL_ALREADY_REGISTERED`, `VALIDATION_FAILED`, `TEST_REQUIRED`, `ACTIVE_REQUEST_EXISTS`.
- **Autenticación:**
  - Registro e inicio de sesión con correo y contraseña. La contraseña se guarda con hash (bcrypt o argon2).
  - JWT de acceso de vida corta, más un refresh token con rotación, guardado con hash y revocable. Cerrar sesión lo invalida.
  - Límite de intentos en el login y el registro.
  - CORS solo para los orígenes de la app (servidor de desarrollo y Capacitor).
- **«Continuar con Google»** aparece en el diseño, pero queda **fuera de la fase 1**. Propón cómo mostrarlo (oculto, o desactivado con un aviso) y pregúntame.
- **Endpoints mínimos** (concreta el detalle en el plan):
  - `auth`: register, login, refresh, logout y me.
  - `pets`: lista con filtros por especie (Gatos / Perros / Otros), necesidades especiales y ubicación, y detalle de cada mascota.
  - `test`: obtener las preguntas y guardar las respuestas.
  - `compatibility`: lista de mascotas ordenada para la persona que ha iniciado sesión.
  - `requests`: crear una solicitud, obtener la activa y cancelarla.
  - Simular la respuesta de la protectora (solo en desarrollo).
  - `health`.
- **Seed idempotente** (`npm run seed`):
  - las seis mascotas con los datos literales del diseño; la foto se guarda como clave del asset;
  - las 15 preguntas;
  - tres cuentas demo: una con el test hecho (respuestas de `PerfilCompletado`), una registrada sin test y una con una solicitud en proceso para Luna;
  - las contraseñas demo salen de variables de entorno;
  - ningún dato de personas reales.
- **Compatibilidad: algoritmo por reglas, transparente, por bloques.**
  - Los tres bloques se combinan con la fórmula del apartado 3.
  - Cada mascota necesita atributos estructurados: si convive con niños o con otras mascotas, qué vivienda necesita, cuántas horas puede pasar sola, cuánto tiempo diario necesita, su nivel de actividad, tamaño y edad, el coste mensual de sus cuidados y sus necesidades especiales.
  - Deriva esos atributos de los textos del diseño y **enséñamelos antes de implementarlos**.
  - Verificación: con las respuestas de la cuenta demo, el orden de las seis mascotas debe ser el del diseño (Luna 92, Coco 85, Simba 81, Kira 76, Nube 70, Rocky 64).
  - No fuerces los valores exactos. Si no salen con reglas razonables, enséñame la diferencia.
- **Umbral de «ninguna mascota compatible»:** no está definido. Es una decisión pendiente.
- **Tests:**
  - unitarios del cálculo y de las reglas;
  - e2e con MongoDB en memoria: autenticación, una sola solicitud activa, cancelación y los códigos de error.

## 7. App (Ionic)

- **Rutas y guards:** según los estados de usuario y las CONEXIONES del canvas.
- **Estilos y componentes:**
  - `tokens.css` generado y `bundle.css` como estilos globales;
  - componentes Angular que envuelven las clases `pp-`, siguiendo el README de cada componente.
- **Errores de red:** se muestran con las pantallas y los textos del diseño.
- **Sesión:**
  - Los tokens se guardan en el almacenamiento seguro del dispositivo (Android Keystore, mediante un plugin de Capacitor).
  - En el navegador, usa la opción más segura que sea viable y explícame el compromiso.
- **Accesibilidad:**
  - tema claro y oscuro, según el sistema y con `data-theme`;
  - texto al 200 % sin cortes (unidades relativas y respeto a la escala de letra de Android en el WebView);
  - reflujo correcto a 206 px de ancho;
  - áreas táctiles de 48 dp como mínimo;
  - los `aria-label` del Design System y foco visible;
  - `prefers-reduced-motion`.
- **Imágenes:** las fotos y las ilustraciones van empaquetadas como assets de la app, porque el sistema de archivos de Render es efímero.

## 8. Despliegue

- **Base de datos:** MongoDB Atlas (clúster gratuito).
- **Backend:** web service de Render para `backend/`, con `render.yaml` y health check en `/health`.
  - Variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS` y `SEED_DEMO_PASSWORD`.
  - Las cuentas las creo yo y pego las variables en Render. Tú me das la lista y los pasos.
- **Plan gratuito de Render:** el servicio se apaga tras 15 minutos sin tráfico y tarda alrededor de un minuto en despertar. Tenlo en cuenta en los timeouts del cliente y propón cómo mitigarlo sin inventar pantallas nuevas.
- **App:** build de Android con Capacitor (APK de depuración) apuntando a la URL de Render.

## 9. Fases y verificación

| Fase | Contenido | Se da por buena cuando… |
|---|---|---|
| F0 | Diseño conectado y sincronización (apartado 2) | Existen la copia de `design/` con su lock, la skill, el design-map, CLAUDE.md y SPEC.md, y el informe de acceso |
| F1 | Backend: autenticación, modelo, seed, cálculo y Swagger | Tests e2e en verde y el orden de compatibilidad de la cuenta demo coincide con el diseño |
| F2 | App: tokens, componentes base (NavigationBar, TopAppBar, Button, TextField, AnimalCard, Dialog…) y pantallas con datos del backend local | Capturas de 412×917 comparadas con `design/reference/` en claro, oscuro y texto al 200 %, con las diferencias corregidas o justificadas |
| F3 | Despliegue en Render y Atlas | La app funciona contra el backend desplegado (smoke test de registro, test y solicitud) |
| F4 | Informe Ionic vs nativo | Fidelidad visual, 48 dp, tema oscuro, texto al 200 %, animación inicial y fluidez en un Android real de gama media |

## 10. Reglas de oro (cópialas a CLAUDE.md)

1. `design/` es de solo lectura, salvo dentro de `/sincronizar-diseno`.
2. Colores, tipografía, formas, espaciados y movimiento salen solo de los tokens generados. Nada a mano.
3. Los textos de la interfaz son los literales del diseño.
4. El código no cambia el diseño. Si algo del diseño no se puede implementar bien, apúntalo en `docs/design-feedback.md` y avísame.
5. Una sola solicitud activa por persona, garantizado en el backend.
6. Ningún secreto en el repositorio ni en el chat.
7. Cada fase termina con evidencia y commit, y espera mi aprobación.

## 11. Decisiones pendientes (pregúntamelas cuando toque)

- «Continuar con Google»: ¿oculto, desactivado o implementado?
- ¿Qué umbral define que no hay ninguna mascota compatible?
- ¿Se puede enviar una solicitud sin haber hecho el test? El diseño sugiere que no.
- ¿Cómo se simula la respuesta de la protectora?
- ¿iOS queda fuera de alcance?

---

**Ahora:** empieza por la Fase 0 en modo plan. Dime qué vía de acceso al diseño funciona y cuál es el plan de la Fase 0. No escribas nada hasta que lo apruebe.
