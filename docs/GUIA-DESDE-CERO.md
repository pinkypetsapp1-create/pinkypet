# Guía para crear una app desde cero

> Cómo hicimos Pinky Pet, paso a paso, para repetirlo con cualquier app nueva.
> Pensada para un equipo de diseño que trabaja con **Claude Design** (diseño) y **Claude Code** (desarrollo).

Esta guía no explica qué es Pinky Pet (eso está en `docs/MEMORIA.md`), sino **cómo se hace**. Cada etapa dice qué hacer, con qué herramienta, qué entregar y qué errores evitar. Los ejemplos son de Pinky Pet; sustituidlos por los de vuestra app.

---

## Mapa del proceso

```
 IDEA        DISEÑO (Claude Design)                         DESARROLLO (Claude Code)                PUBLICAR
 ────        ──────────────────────                         ────────────────────────                ────────
 Brief  →  Wireframe → Baja → Identidad → Design System  →  F0 Conectar diseño → F1 Servidor  →  Web, Android
 (1 día)   (Figma)    fidel.  (color, tipo,  + Media y Alta   F2 App → F3 Nube y APK            (APK / Play Store),
                              marca)         fidelidad       F4 Informe                          iOS
           ↑──────────────── ajustes: siempre DS → Alta fidelidad → código ─────────────────────↑
```

**Duración real en Pinky Pet:** diseño del 9 al 25 de noviembre; desarrollo del 23 al 26 (con el diseño ya casi cerrado).

**La regla que lo sostiene todo:** el diseño es la fuente de verdad. Cualquier cambio visual se hace en este orden: **Design System → Alta fidelidad → código**. El código nunca inventa un color, una medida ni un texto.

---

## Parte 1 · Antes de diseñar: el brief

Escribid en una página (un doc de Claude Docs o un `.md`):

1. **El problema** en una frase. *Ej.: «Muchas adopciones fracasan porque la mascota no encaja con la vida de la familia».*
2. **Para quién** es y en qué situación la usa.
3. **Los objetivos** (3–4), medibles si se puede.
4. **Las plataformas** y el lienzo: *Android, 412 × 917 dp*. ¿Web? ¿iOS? Decididlo ya: cambia el trabajo de la Fase 3.
5. **Las reglas del curso o del cliente**: accesibilidad (WCAG 2.2), idioma, lo que no se puede prometer (*«el resultado orienta, no garantiza»*).
6. **Qué queda fuera** (alcance). Lo que no se escribe aquí acaba apareciendo a mitad de proyecto.

**Entregable:** el brief aprobado por el equipo.

---

## Parte 2 · Diseño en Claude Design

### 2.1 Wireframe y traspaso

- Si partís de **Figma**, traed las pantallas a un lienzo de Claude Design **tal cual**, enlazadas entre sí, para recorrerlas como prototipo (botón Play).
- Recorred **todos** los flujos y apuntad los problemas en una tabla: *problema · por qué importa · propuesta*.
  - En Pinky Pet salieron 9: pantallas imposibles de alcanzar, «Ver mi solicitud» que llevaba a «Sin solicitud», no había forma de iniciar sesión, todas las mascotas salían compatibles, el «92 %» parecía una medición exacta, faltaban errores…
- Convertid las **variantes repetidas en estados** (16 frames de filtros → 2 pantallas con filtros que funcionan) y los elementos repetidos en **componentes base** (ficha, estado).

### 2.2 Baja fidelidad

- **Solo estructura:** grises, siluetas, textos reales. Nada de color.
- Resolved aquí la navegación, los estados de cada pantalla y los textos de botones (*verbo + objeto: «Enviar solicitud de adopción»*, nunca «Aceptar»).
- Definid los **estados de la persona usuaria** (sin cuenta, registrada, con test, con solicitud…) y qué ve en cada uno.

### 2.3 Identidad

1. **Color:** una semilla en **Material Theme Builder** → exportad el JSON (6 esquemas: claro, oscuro y contraste medio/alto).
   - Validad el claro y el oscuro con una **tabla de contraste** (texto ≥ 4,5:1; iconos y bordes de control ≥ 3:1).
   - Si un rol del export no funciona (contenedores demasiado oscuros), sustituidlo por el tono estándar de M3 de la misma paleta y documentadlo.
2. **Tipografía:** una para títulos (marca) y otra para el resto. *Pinky Pet: Fraunces + Roboto.* Las cifras, en la funcional.
3. **Marca:** 2–3 propuestas de nombre e imagotipo, con versión invertida, a una tinta e **icono de app** a 96/48/24 px. Probad el sello con varias tipografías.

### 2.4 Design System (el corazón del proyecto)

Un artifact de tipo **Design System** con:

| Pieza | Qué es | Para qué sirve después |
|---|---|---|
| `tokens.json` | Colores (por tema), tipografía, espaciado, radios, sombras, opacidades, medidas | El código genera su CSS de aquí, **nunca a mano** |
| `components/bundle.css` | Clases de cada componente con prefijo (`pp-`) | La app usa estas clases tal cual |
| `components/<C>/README.md` | Anatomía, estados, reglas, textos y tokens de cada componente | Lo lee Claude Code para programarlo igual |
| Assets | Logotipo (SVG), ilustraciones, fotos con su **especificación** (tamaños, encuadre, nombre de archivo) | Icono de la app, pantallas, fotos |
| `README.md` | Reglas de color, tono de los textos, accesibilidad, decisiones con código (D1, UX3, COL2…) | La «constitución» del diseño |

**Consejo:** apuntad cada decisión con un código y una fecha (*COL2 (17/11): el malva pasa a primary*). Meses después sabréis por qué algo es como es.

### 2.5 Fidelidad media y alta fidelidad

- **Media:** la estructura validada + identidad + componentes reales. Huecos de foto.
- **Alta:** **todas las pantallas y todos los estados**. Pinky Pet tiene 116. Que no falte:
  - [ ] Cada estado de la persona usuaria
  - [ ] Errores (sin conexión, formulario, envío) y estados vacíos
  - [ ] Cargas y confirmaciones (diálogos)
  - [ ] **Modo oscuro**, **texto al 200 %** y **206 px de ancho** (zoom al 200 %)
  - [ ] Notas **«CONEXIONES»** en el lienzo: a dónde lleva cada botón
  - [ ] Textos definitivos (son los que copiará el código literalmente)
- Fotos reales o de simulación, con texto alternativo.

**Entregable de diseño:** Design System + Alta fidelidad, con un responsable que los apruebe. El histórico (baja, media, propuestas) se congela: el código **no** lo usa.

---

## Parte 3 · Preparar el ordenador y las cuentas

### 3.1 En el ordenador

| Herramienta | Para qué | Cómo |
|---|---|---|
| **Node.js LTS** | Servidor y app | <https://nodejs.org> (instalador `.pkg`) |
| **git** | Guardar versiones | Viene con macOS (lo ofrece al escribir `git`) |
| **Claude Code** | Desarrollar con Claude | Terminal, app de escritorio o extensión de VS Code |
| **Claude en Chrome** | Que Claude abra páginas, capture pantallas y os guíe | Extensión de Chrome |
| **Java 25** + **SDK de Android** | Generar el APK | Ver `docs/DEPLOY.md` §4 (sin Android Studio ni permisos de administración) |
| **Xcode** | Solo para iOS | App Store (≈ 15 GB) + `sudo xcode-select -s …` |

### 3.2 Cuentas (todas tienen plan gratuito)

Creadlas **cuando toque**, no todas al principio:

| Cuenta | Para qué | Cuándo |
|---|---|---|
| **GitHub** | Guardar el código y publicar automáticamente | Antes de empezar |
| **MongoDB Atlas** | Base de datos en la nube | Fase 3 |
| **Render** | Servidor y web en la nube | Fase 3 |
| **Google Cloud** | «Continuar con Google» | Si lo hay en el diseño |
| **Brevo** | Correos (recuperar contraseña) | Si hay correos |
| **cron-job.org** | Que el servidor gratuito no se duerma | Antes de presentar |
| **Google Play Console** | Publicar en la tienda (25 $, una vez) | Al final |

---

## Parte 4 · Arrancar con Claude Code

### 4.1 El prompt inicial (el documento más importante)

Cread una carpeta vacía, `git init`, y guardad dentro `docs/PROMPT-INICIAL.md`. El de Pinky Pet es la plantilla; sus apartados:

| # | Apartado | Qué poner |
|---|---|---|
| 0 | Contexto y forma de trabajar | Qué es, quiénes sois (*«estudiantes de diseño: explícame en pocas líneas»*), trabajo por fases, no inventar requisitos, secretos fuera del chat |
| 1 | Fuentes del diseño y prioridad | URLs del Design System y de Alta fidelidad, su versión, y qué manda en caso de choque |
| 2 | Fase 0 | Copiar el diseño al repo con verificación, tokens generados, `CLAUDE.md` y `SPEC.md` |
| 3 | Cómo leer el diseño | Lo que ya sabéis del lienzo: instancias, sufijos (Oscuro, Texto, Zoom), datos de ejemplo |
| 4 | Producto y reglas de negocio | Estados de la persona usuaria, qué exige cada acción, reglas que **debe garantizar el servidor** |
| 5–7 | Stack, servidor y app | Tecnologías, módulos, endpoints mínimos, errores con códigos estables, accesibilidad |
| 8 | Despliegue | Dónde se publica y qué variables hacen falta |
| 9 | Fases y verificación | Qué se entrega en cada fase y **cómo se comprueba** |
| 10 | Reglas de oro | Las que Claude copiará a `CLAUDE.md` |
| 11 | Decisiones pendientes | Lo que todavía no sabéis: que os lo pregunte cuando toque |

Arrancad Claude Code en **modo plan** y escribid:
> Lee @docs/PROMPT-INICIAL.md y empieza por la Fase 0.

### 4.2 Forma de trabajar que funcionó

- **Por fases:** plan → vuestro OK → implementación → **evidencia** (tests, capturas) → commit → **para**.
- **Decisiones con recomendación:** pedidle *«en cada decisión, recomiéndame la opción que mejor encaje con el diseño, explícame por qué en pocas líneas y espera mi OK»*. Claude lo guarda en su memoria.
- **Observaciones del equipo en un `.md`:** al probar la app, apuntad lo que veáis en un archivo (`docs/observaciones-AAAA-MM-DD.md`) y pedid que lo resuelva punto por punto.
- **Para retomar:** antes de cerrar, pedid *«prepara un md para poder continuar»*; al volver, *«Lee docs/CONTINUAR.md y retomamos»*.

### 4.3 Las siete reglas de oro (copiadlas)

1. La copia del diseño es de solo lectura (salvo al sincronizar).
2. Colores, tipografía, formas, espaciados y movimiento salen solo de los tokens generados.
3. Los textos de la interfaz son los literales del diseño.
4. El código no cambia el diseño. Lo que no se pueda implementar bien se apunta en `docs/design-feedback.md`.
5. *(Regla de negocio crítica de vuestra app, garantizada en el servidor. Pinky Pet: una sola solicitud activa por persona.)*
6. Ningún secreto en el repositorio ni en el chat.
7. Cada fase termina con evidencia y commit, y espera la aprobación del equipo.

---

## Parte 5 · Las fases de desarrollo

### Fase 0 · Conectar con el diseño (½ día)

**Qué pedir:** que lea los dos artifacts, los copie a `design/` con un **lock** (huella sha256 de cada archivo), cree el generador de tokens, la skill `/sincronizar-diseno`, `docs/design-map.md` (componente y ruta de cada pantalla), `CLAUDE.md` y `docs/SPEC.md`.

**Se da por buena cuando:** el lock da **0 discrepancias** y los tokens se generan igual dos veces seguidas.

### Fase 1 · Servidor (1 día)

**Qué pedir:** API (NestJS + MongoDB en Pinky Pet) con cuentas, datos de ejemplo (**seed** con los literales del diseño), la lógica principal (el cálculo) y documentación automática (Swagger).

**Claves:**
- Errores con **códigos estables** (`EMAIL_ALREADY_REGISTERED`…) que la app traduce a los textos del diseño.
- Contraseñas con hash, sesiones con renovación, límite de intentos.
- Si hay un algoritmo, que sea **transparente** y que te enseñe los datos que usa antes de programarlo.

**Se da por buena cuando:** los tests (unitarios y e2e con base de datos en memoria) están en verde.

### Fase 2 · App (1–2 días)

**Qué pedir:** la app (Ionic + Angular + Capacitor en Pinky Pet) con los componentes del Design System y todas las pantallas, conectada al servidor local. Conviene en **entregas** (2a: base y cuentas · 2b: catálogo y ficha · 2c: proceso, perfil y errores).

**Claves:**
- Ionic solo como estructura: lo visual sale de las clases del Design System.
- Fuentes **empaquetadas** en la app (no desde Google Fonts).
- Accesibilidad: tema oscuro, texto al 200 %, 206 px, 48 dp, foco visible, movimiento reducido.

**Se da por buena cuando:** las **capturas** (claro, oscuro, 206 px) se comparan con el diseño y las diferencias están corregidas o apuntadas en `design-feedback.md`.

### Fase 3 · Nube, web y APK (1 día)

Orden: **Atlas → Render → web → Google → APK → prueba**. Pasos exactos en `docs/DEPLOY.md`.

**Se da por buena cuando:** la prueba automática contra la nube (`npm run smoke`) pasa y la app funciona en un **móvil real**.

### Fase 4 · Informe (si lo pide el curso)

Medir en un móvil real lo que pida el brief (en Pinky Pet: fidelidad, 48 dp, oscuro, 200 %, animación, fluidez) y escribir el informe.

---

## Parte 6 · Publicar

| Dónde | Qué hace falta | Notas |
|---|---|---|
| **Web** | Render (sitio estático) | Se actualiza sola con cada `git push` |
| **APK** (instalar a mano) | Java + SDK, `./gradlew assembleDebug` | `docs/DEPLOY.md` §4. Icono: `npm run iconos` |
| **Google Play · prueba interna** | Cuenta de Play Console, **AAB firmado** con clave propia, ficha básica | Hasta 100 personas, sin esperar. Lo recomendado para un proyecto de clase |
| **Google Play · producción** | Todo lo anterior + **borrar cuenta** (en la app y en web), **política de privacidad**, formulario de seguridad de datos, clasificación por edades, cuenta demo para revisión, y si la cuenta es personal, **prueba cerrada de 12 personas durante 14 días** | Diseñad «borrar cuenta» desde el principio si vais a publicar |
| **iOS** | Mac con Xcode; para el simulador no hace falta cuenta de Apple | `docs/IOS.md` |

---

## Parte 7 · Mantener y hacer crecer la app

- **Un cambio de diseño:** se hace en Claude Design (DS → Alta fidelidad) y se trae con `/sincronizar-diseno`.
- **Contenido nuevo sin programar:** una ficha en castellano + un comando (`/nueva-mascota` en Pinky Pet). Vale para cualquier catálogo (productos, actividades, recetas…).
- **Presentarlo:** pedid una **memoria** (`docs/MEMORIA.md`) y una **presentación** con el estilo del Design System (capturas de cada etapa).

---

## Parte 8 · Errores que nos encontramos (y cómo evitarlos)

| Problema | Causa | Cómo evitarlo |
|---|---|---|
| «Continuar con Google» daba `redirect_uri_mismatch` en la web | Google exige registrar la dirección exacta de vuelta | Registrar la raíz de la web (`https://tu-app/`) y `http://localhost:8100/` en el cliente OAuth |
| Google no funcionaba en el APK | Faltaba el cliente **Android** (paquete + SHA-1) y el plugin no admite `scopes` en Android | Crear el cliente Android; la SHA-1 cambia con la clave de firma |
| El primer acceso tardaba casi un minuto | Render gratuito se duerme tras 15 min | Aviso cada 10 min con cron-job.org, o plan de pago |
| Tarjetas cortadas en un móvil real | El diseño era de 412 px y muchos Android son más estrechos | Probar a 360 y 393 px; definir en el DS qué pasa por debajo de 412 |
| La app quedaba debajo de las barras de Android 15 | Android 15 dibuja la app de borde a borde | Usar `env(safe-area-inset-*)` en las barras desde el principio |
| El APK enseñaba el icono de Capacitor | El proyecto Android trae iconos por defecto | Generarlos del isotipo del DS (`npm run iconos`) |
| Gradle no compilaba | Gradle 8 no funciona con Java 25 | Gradle 9.1 o superior |
| No se podía instalar con Homebrew | En ordenadores compartidos Homebrew es de otro usuario | Instalar el SDK en la carpeta personal, sin administración |
| Demasiados intentos (error 429) en las pruebas | El límite de intentos protege el inicio de sesión | Subir el límite **solo** en local (`AUTH_THROTTLE_LIMIT`) |
| Una mascota nueva rompía los tests | Los tests daban por hecho «6 mascotas» | Tests que se apoyan en los datos, no en números fijos |
| Un texto del diseño no cabía | El diseño no contemplaba ese caso | Apuntarlo en `design-feedback.md` y decidirlo en el DS |

---

## Parte 9 · Seguridad, lo mínimo

- **Nunca pegues contraseñas ni tokens en el chat**: escríbelos tú en el panel del servicio (Render, Atlas) o en el archivo `.env` local. Si alguno se ha pegado, cámbialo al acabar.
- `.env` siempre en `.gitignore`; `.env.example` con las claves **vacías**.
- Las claves de servicios (Brevo, base de datos) solo en el panel de Render.
- La clave de firma de Android (AAB) **guardadla bien**: sin ella no se puede actualizar la app en la tienda.

---

## Parte 10 · Plantillas rápidas

**Arrancar:**
> Lee @docs/PROMPT-INICIAL.md y empieza por la Fase 0.

**Fijar la forma de decidir:**
> A partir de ahora, en cada decisión pendiente, recomiéndame la opción que mejor encaje con el diseño, explícame por qué en pocas líneas y espera mi OK.

**Pedir una fase:**
> Enséñame el plan de la Fase N, la lista de capturas que necesitas y tus recomendaciones. No empieces hasta que te diga «adelante».

**Observaciones del equipo:**
> Te paso unas observaciones de la app; dámelas en un .md para el terminal y resuélvelas una a una, empezando por el diseño.

**Retomar:**
> Prepara un md para poder continuar. · (al volver) Lee docs/CONTINUAR.md y retomamos.

**Revisar el estado:**
> Revisa el roadmap y dime si todo está correcto (tests, diseño, nube y GitHub).

---

## Documentos de Pinky Pet que podéis copiar como plantilla

| Documento | Para qué |
|---|---|
| `docs/PROMPT-INICIAL.md` | Plantilla del prompt inicial |
| `CLAUDE.md` | Reglas de oro y comandos |
| `docs/SPEC.md` | Especificación viva y decisiones |
| `docs/design-map.md` | Diseño → código |
| `docs/design-feedback.md` | Problemas del diseño y su solución |
| `docs/DEPLOY.md` | Nube, Google, correo, APK |
| `docs/IOS.md` | Simulador de iPhone |
| `docs/CONTINUAR.md` | Retomar el trabajo |
| `docs/MEMORIA.md` | Memoria para presentar |
| `.claude/skills/` | Comandos `/sincronizar-diseno` y `/nueva-mascota` |
