# Pinky Pet · Especificación

> Documento vivo. Recoge `docs/PROMPT-INICIAL.md` (§3–§11) más lo verificado en el diseño (DS `1795433635-941c`, AF `1795433636-1cea`). Si algo de aquí choca con el diseño, se para y se pregunta.

## 1. Qué es y fuentes

App Android (lienzo de 412 × 917 dp) para valorar la compatibilidad entre una persona y una mascota antes de adoptarla. Es un **proyecto académico de UX/UI**: los datos son simulados y el algoritmo es una simulación, no un instrumento validado.

**Orden de prioridad:**
1. Design System, para todo lo visual.
2. Alta fidelidad, para pantallas, estados, textos y flujos.
3. Este documento, para backend, datos y reglas que el diseño no cubre.

La copia local está en `design/` (ver `design/design.lock.json`). Las notas del DS que citan la «fidelidad media» como fuente de verdad están desactualizadas (`docs/design-feedback.md` F0-4).

## 2. Cómo leer el diseño (verificado)

- Los `*.dc.html` usan el runtime de Claude Design (`x-dc`, `dc-import`, `sc-if`, `sc-for`, `DCLogic`). Son referencia visual y de comportamiento, **no código para copiar**: cada pantalla se reconstruye en Angular con las clases `pp-` y los tokens.
- Muchos boards son **instancias** de una base con props distintas. Por ejemplo:
  - `Ficha-Luna` = `Ficha animal="luna"`;
  - `Ficha-Limite` = `Ficha animal="rocky" limite limite-abierto segunda="Luna"`;
  - `Error-Envio` = `Ficha animal="luna" errorEnvio`;
  - `Error-Cancelar` = `Estado animal="luna" errorCancel`;
  - `Compatibles` = `Catalogo estado="completo"`;
  - `Inicio-Registrado` = `Main estado="registrado"`;
  - `Test-Error` = `Test error`.
- Los sufijos de accesibilidad son estados: «Oscuro» (tema oscuro), «Texto 200 %» (texto del sistema al 200 %; iconos, botones y huecos no cambian) y «Zoom» / «a 206 px» (reflujo: maqueta a 206 × 458 px mostrada al doble; sin scroll horizontal, WCAG 1.4.10). **La app debe soportar los tres en todas las pantallas.**
- Las notas «CONEXIONES» de `canvas.json` definen la navegación (resumidas en §5).

## 3. Estados de usuario

| Clave | Estado | Cómo se reconoce |
|---|---|---|
| I | Sin cuenta | sin sesión |
| R | Registrado sin test | sesión y sin respuestas |
| T | Con test, sin solicitud activa | sesión, 15 respuestas y sin solicitud en proceso |
| S | Con solicitud en proceso | sesión, test y una solicitud en estado `en_proceso` |

Reglas por estado (§4 del prompt, confirmadas por las CONEXIONES):
- **I:** ve Inicio, Mascotas (sin %), Cómo adoptar y Mi perfil vacío. «Ver compatibilidad» y «Descubrir mi compatibilidad» llevan a Registro.
- **R:** esos mismos botones llevan al Test.
- **T:** ve el % de cada mascota y la lista de compatibles ordenada; Mi perfil muestra sus respuestas; «Modificar mis respuestas» abre el test con las respuestas marcadas y recalcula al guardar.
- **S:** igual que T, más el estado de su solicitud; las pestañas llevan a las versiones «con solicitud en proceso».

## 4. Datos del diseño (fuente de los mocks)

### 4.1 Mascotas (`Ficha.dc.html` → `D`, `FOTO`; `Catalogo.dc.html` → `animals`)

| id | Nombre | Especie · sexo · edad · ciudad · tamaño | Tipo (filtro) | NE | % | Hogar / Día a día / Mascota | Motivo corto (tarjeta) |
|---|---|---|---|---|---|---|---|
| luna | Luna | Gata · Hembra · 3 años · Barcelona · Pequeño | gato | sí | 92 | 95 / 90 / 90 | Encaja con tu rutina |
| simba | Simba | Gato · Macho · 1 año · Badalona · Pequeño | gato | no | 81 | 85 / 75 / 83 | Necesita juego diario |
| rocky | Rocky | Perro · Macho · 5 años · Sabadell · Grande | perro | no | 64 | 55 / 70 / 67 | Necesita mucho espacio |
| kira | Kira | Perra · Hembra · 8 años · Barcelona · Mediano | perro | sí | 76 | 80 / 75 / 73 | Necesita paseos cortos |
| coco | Coco | Conejo · Macho · 2 años · L'Hospitalet de Llobregat · Pequeño | otros | no | 85 | 90 / 85 / 80 | Encaja con tu espacio |
| nube | Nube | Cobaya · Hembra · 4 años · Terrassa · Pequeño | otros | sí | 70 | 75 / 70 / 65 | Necesita cuidado dental |

NE = necesidades especiales. Los 8 campos de información (en este orden: Estado de salud · Vacunación · Cuidados que necesita · Su comportamiento · Su nivel de actividad · Convivencia con mascotas · Necesidades especiales · Su historia), los textos «Lo que encaja contigo» (`encaja`) y «Para que os vaya bien» (`cuenta`) se copian **literalmente** de `design/alta-fidelidad/Ficha.dc.html` en el seed. Un dato desconocido se muestra como «Dato no disponible».

**Fotos:** `design/design-system/assets/Fotos/<id>.jpg` (las de Alta fidelidad son idénticas byte a byte). Textos alternativos:
- Luna: «Luna, gata gris y blanca, sentada junto a un muro de piedra y unas flores»
- Simba: «Simba, gato naranja y blanco, sentado en un camino de piedra»
- Rocky: «Rocky, perro de pelo dorado, sentado en el césped con la lengua fuera»
- Kira: «Kira, perra blanca y marrón con collar rosa, sentada en un parque»
- Coco: «Coco, conejo blanco y beige de orejas caídas, sentado sobre una alfombra»
- Nube: «Nube, cobaya blanca y naranja sobre una manta azul»

**Filtro de ubicación:** el diseño filtra por **provincia** (menú con las provincias de España), no por ciudad. Todas las mascotas están en la provincia de Barcelona, así que cualquier otra provincia muestra el vacío «No hay mascotas con estos filtros». El modelo necesita `ciudad` y `provincia`.

### 4.2 Test (`Test.dc.html`)

15 preguntas en 3 bloques de 5. Pesos mostrados: «34 % del test» / «33 %» / «33 %».

| # | Bloque | Pregunta | Opciones |
|---|---|---|---|
| 1 | Mi hogar | ¿Hay niños pequeños en casa? | Sí · No |
| 2 | Mi hogar | ¿Hay otras mascotas en casa? | No · Sí, perros o gatos · Sí, otras mascotas |
| 3 | Mi hogar | ¿Todas las personas con las que vives están de acuerdo con la adopción? 💡 | Sí · No · Vivo sola o solo |
| 4 | Mi hogar | ¿En qué tipo de vivienda vives? | Piso sin terraza · Piso con terraza o balcón · Casa con jardín |
| 5 | Mi hogar | ¿Tu vivienda permite tener mascotas? | Sí, es propia · Sí, el alquiler lo permite · No lo sé |
| 6 | Mi día a día | ¿Cuánto tiempo estaría solo la mascota en casa? 💡 | Menos de 4 horas · Entre 4 y 8 horas · Más de 8 horas |
| 7 | Mi día a día | ¿Cuánto tiempo al día puedes dedicarle? | Menos de 1 hora · Entre 1 y 2 horas · Más de 2 horas |
| 8 | Mi día a día | Si viajas o enfermas, ¿quién cuidaría de la mascota? | Alguien de mi casa · Familia o amistades · No lo sé todavía |
| 9 | Mi día a día | ¿Cómo es tu ritmo de vida? | Tranquilo · Moderado · Muy activo |
| 10 | Mi día a día | ¿Has tenido mascotas antes? | Nunca · Sí, en casa familiar · Sí, bajo mi responsabilidad |
| 11 | La mascota que busco | ¿De qué tamaño buscas a la mascota? | Pequeño · Mediano · Grande |
| 12 | La mascota que busco | ¿Qué nivel de actividad buscas en la mascota? | Bajo · Medio · Alto |
| 13 | La mascota que busco | ¿Qué edad prefieres? | Cachorro · Adulto · Mayor · Me da igual |
| 14 | La mascota que busco | ¿Cuánto puedes dedicar cada mes a sus cuidados (comida, veterinario…)? 💡 | Menos de 50 € · Entre 50 y 100 € · Más de 100 € |
| 15 | La mascota que busco | ¿Adoptarías una mascota con necesidades especiales? | Sí · Depende de sus necesidades · No |

💡 = lleva «Consejo del experto» (texto literal en `Test.dc.html`).

Errores: en cada pregunta sin responder aparece «Responde esta pregunta para continuar.», y el resumen dice «Te falta 1 pregunta por responder: la N.» o «Te faltan N preguntas por responder: a, b y c.». El contador: «X de 15 respondidas · Responde todas para ver tus mascotas compatibles.».

### 4.3 Cuenta demo con el test hecho (`PerfilCompletado.dc.html` = `Test` con `completo`)

Correo `persona@ejemplo.com`. Respuestas: 1 No · 2 No · 3 Vivo sola o solo · 4 Piso con terraza o balcón · 5 Sí, el alquiler lo permite · 6 Entre 4 y 8 horas · 7 Entre 1 y 2 horas · 8 Familia o amistades · 9 Tranquilo · 10 Sí, en casa familiar · 11 Pequeño · 12 Medio · 13 Me da igual · 14 Entre 50 y 100 € · 15 Depende de sus necesidades.

### 4.4 Fórmula del % global (deducida; no aparece en el código del diseño)

`global = round(0,34 · hogar + 0,33 · día a día + 0,33 · mascota)`. Cuadra con las seis mascotas:

| Mascota | Cálculo | Resultado | Diseño |
|---|---|---|---|
| Luna | 91,70 | 92 | 92 ✓ |
| Simba | 81,04 | 81 | 81 ✓ |
| Rocky | 63,91 | 64 | 64 ✓ |
| Kira | 76,04 | 76 | 76 ✓ |
| Coco | 85,05 | 85 | 85 ✓ |
| Nube | 70,05 | 70 | 70 ✓ |

Orden esperado para la cuenta demo: **Luna 92 · Coco 85 · Simba 81 · Kira 76 · Nube 70 · Rocky 64**.

### 4.5 Estados de la solicitud (`Estado.dc.html`, prop `fase`)

| Fase | Etiqueta | Título / mensaje | Pasos |
|---|---|---|---|
| `proceso` | En proceso | «Has enviado tu solicitud de adopción. Ahora toca esperar una respuesta.» | Solicitud enviada ✓ → **Esperando respuesta** → Adopción finalizada |
| `finalizada` | Adopción finalizada | «¡La protectora ha aceptado tu solicitud!» · «Se pondrá en contacto contigo para preparar la llegada de {nombre} a casa.» | Solicitud enviada ✓ → Respuesta recibida ✓ → Adopción finalizada ✓ |
| `rechazada` | No disponible | «Esta mascota ya no está disponible» · «Lo sentimos: {nombre} ya no está disponible para adopción. Puedes volver a tus mascotas compatibles y elegir otro.» | Solicitud enviada ✓ → Respuesta recibida ✓ → ✕ No disponible |
| `cancelada` | Cancelada | «Has cancelado tu solicitud» · «{nombre} sigue disponible por si cambias de idea. Puedes volver a tus mascotas compatibles cuando quieras.» | Solicitud enviada ✓ → ✕ Solicitud cancelada |

Diálogos (textos literales en `Ficha.dc.html` y `Estado.dc.html`):
- confirmar el envío: «¿Enviar tu solicitud para adoptar a {nombre}?»;
- aviso tras enviar: «Solicitud enviada»;
- límite: «¿Cancelar tu solicitud anterior?» (Salir y mantener la anterior / Continuar y cancelar la anterior);
- confirmar la cancelación: «¿Seguro que quieres cancelar tu solicitud para adoptar a {nombre}?»;
- errores de envío y de cancelación.

### 4.6 Registro e inicio de sesión (`Registro.dc.html`, `Login.dc.html`)

- Correo válido: `^[^@\s]+@[^@\s]+\.[^@\s]+$` → si no, «Escribe un correo completo, por ejemplo nombre@correo.com.»
- Registro: contraseña de ≥ 8 caracteres → si no, «La contraseña debe tener al menos 8 caracteres.» o «… Ahora tiene N.». Resumen: «Revisa los 2 campos marcados para crear tu cuenta.» / «Revisa el campo marcado para crear tu cuenta.»
- Login: contraseña vacía → «Escribe tu contraseña.». Resumen: «Revisa los 2 campos marcados para iniciar sesión.» / «Revisa el campo marcado para iniciar sesión.»

## 5. Navegación (resumen de las CONEXIONES)

- Login con éxito → Inicio (según el estado). Registro con éxito → Test. *El diseño lleva el login a «Inicio · con test hecho» porque la cuenta del ejemplo ya tiene test; la app irá al Inicio que corresponda al estado real.*
- Test completo → «Ver mis mascotas compatibles» → Compatibles. Test incompleto → errores en la misma pantalla.
- Ficha sin enviar → «Enviar solicitud de adopción» → diálogo → Estado de esa mascota con el aviso «Solicitud enviada».
- Con solicitud en proceso, la ficha de **otra** mascota → Enviar → diálogo de límite → «Continuar y cancelar la anterior» cancela la anterior, envía la nueva y abre su Estado.
- Estado en proceso → «Cancelar solicitud» → diálogo → estado «Cancelada» en la misma pantalla (ya se puede enviar otra).
- Sin compatibles → «Revisar mis respuestas» → Mi perfil.
- Sin conexión (catálogo) → «Reintentar».
- Registro y Login no muestran la barra de navegación.

## 6. Reglas de negocio

- **Una sola solicitud activa por persona**, garantizada en el backend (índice único parcial en Mongo sobre `userId` con `estado: 'en_proceso'`). Si se intenta enviar otra: error `ACTIVE_REQUEST_EXISTS` → diálogo de `Ficha-Limite`.
- **Cancelar** pide confirmación; la mascota sigue disponible.
- **Enviar una solicitud** exige cuenta y test (pendiente de confirmar: §10).
- **Respuesta de la protectora:** el paso de `en_proceso` a `finalizada` o `rechazada` se simula con un endpoint o un script que solo existe en desarrollo.
- **El % orienta, no decide.** Texto del diseño: «Este resultado te orienta según tus respuestas. La protectora te ayudará a confirmar el encaje antes de la adopción.»
- **Vocabulario:** «mascota», nunca «animal», en la interfaz. Los botones, con su texto literal.
- **Primer inicio:** la animación (`Huella`, `SplashPrimerInicio`) dura 1,55 s, solo aparece la primera vez, en claro y en oscuro, y no se muestra con `prefers-reduced-motion`. Va después de la pantalla de arranque del sistema, no la sustituye.

## 7. Arquitectura

```
CLAUDE.md · docs/ · design/ (solo lectura) · scripts/ · backend/ (NestJS + MongoDB) · app/ (Ionic + Angular standalone + Capacitor)
```
- Node LTS y TypeScript estricto en las dos partes.
- Contrato de la API: OpenAPI generado por Nest; el cliente de la app se tipa a partir de él. El backend no depende del frontend.
- Ionic solo como estructura (router, pestañas, `ion-content`, Capacitor). Lo visual sale de las clases `pp-` y de los tokens; ningún `ion-*` con su estilo «md» por defecto.
- Fuentes empaquetadas: Fraunces, Roboto y Material Symbols Rounded.
- Tokens: `npm run tokens` genera `app/src/theme/tokens.css` (claro en `:root`, oscuro en `[data-theme="dark"]`, contraste medio y alto con `.pp-contrast-medium` y `.pp-contrast-high`). El movimiento sale de `bundle.css`.

## 8. Backend

- **Módulos:** `auth`, `users`, `pets`, `compatibility` (test y cálculo), `adoption-requests` y `health`.
- **Errores** con código estable que la app traduce a los textos del diseño:

| Código | Pantalla |
|---|---|
| `AUTH_INVALID_CREDENTIALS` | Error-Login |
| `EMAIL_ALREADY_REGISTERED` | Error-Registro-Existe |
| `VALIDATION_FAILED` | Error-Registro-Campos (y validación del test) |
| `TEST_REQUIRED` | solicitud o compatibilidad sin test |
| `ACTIVE_REQUEST_EXISTS` | Ficha-Limite |
| error de red / timeout (cliente) | Error-Catalogo, Error-Envio, Error-Cancelar |

- **Autenticación:**
  - contraseñas con hash (argon2 o bcrypt);
  - JWT de acceso corto y refresh token con rotación, guardado con hash y revocable (logout);
  - límite de intentos en login y registro;
  - CORS solo para los orígenes de la app.
- **Endpoints mínimos:**
  - `auth`: register, login, refresh, logout, me;
  - `pets`: lista con filtros (tipo, NE, provincia) y detalle;
  - `test`: preguntas y respuestas;
  - `compatibility`: lista ordenada;
  - `requests`: crear, ver la activa y cancelar;
  - simulación de la protectora (solo en desarrollo);
  - `health`.
- **Seed idempotente** (`npm run seed`):
  - las 6 mascotas con los textos literales (la foto como clave del asset) y las 15 preguntas;
  - 3 cuentas demo: una con test (respuestas de §4.3), una registrada sin test y una con una solicitud en proceso para Luna;
  - contraseñas desde variables de entorno y ningún dato de personas reales.
- **Compatibilidad:** reglas transparentes por bloques sobre atributos estructurados de cada mascota (niños, otras mascotas, vivienda, horas sola, tiempo diario, actividad, tamaño, edad, coste mensual y NE).
  - Los atributos se derivan de los textos de §4.1 y **se enseñan antes de implementarlos**.
  - Verificación: el orden de la cuenta demo coincide con el de §4.4. Si no sale con reglas razonables, se enseña la diferencia en lugar de forzarlo.
- **Tests:** unitarios del cálculo; e2e con Mongo en memoria (autenticación, una sola solicitud activa, cancelación y códigos de error).

## 9. App y despliegue

- Rutas y guards según §3 y `docs/design-map.md`.
- Sesión en almacenamiento seguro (Android Keystore vía plugin de Capacitor). En el navegador, la opción más segura que sea viable, con el compromiso explicado.
- **Accesibilidad:**
  - tema claro y oscuro según el sistema y con `data-theme`;
  - texto al 200 % sin cortes;
  - reflujo a 206 px;
  - áreas táctiles de 48 dp;
  - los `aria-label` del DS y foco visible;
  - `prefers-reduced-motion`.
- Imágenes empaquetadas en la app.
- **Despliegue:**
  - base de datos en MongoDB Atlas (gratuito);
  - backend en un web service de Render (`render.yaml`, health check en `/health`) con las variables `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS` y `SEED_DEMO_PASSWORD`;
  - APK de depuración apuntando a Render;
  - el plan gratuito de Render se apaga tras 15 minutos y tarda unos 60 s en despertar: hay que tenerlo en cuenta en los timeouts del cliente, sin inventar pantallas.

## 10. Decisiones pendientes

| Decisión | Notas | Estado |
|---|---|---|
| «Continuar con Google» | Fuera de la fase 1. ¿Oculto o desactivado con aviso? | pendiente |
| Umbral de «ninguna mascota compatible» | No está definido en el diseño (`Error-SinCompatibles`). | pendiente |
| ¿Solicitud sin test? | El diseño sugiere que no: solo hay ficha con botón de envío en el estado T. | pendiente de confirmar |
| Simulación de la protectora | Endpoint o script solo de desarrollo. | pendiente |
| ¿iOS fuera de alcance? | — | pendiente |
| Capturas de referencia | Las exporta el equipo a `design/_incoming/reference/`. | en espera |
| Mitigar el arranque en frío de Render | Usar los estados de carga existentes (por ejemplo, el del botón) y timeouts largos, sin pantallas nuevas. | proponer en F3 |

## 11. Fases

| Fase | Se da por buena cuando… |
|---|---|
| F0 | Existen `design/` con su lock, la skill `/sincronizar-diseno`, el design-map, CLAUDE.md y SPEC.md, y el informe de acceso ✓ |
| F1 | Tests e2e en verde y el orden de compatibilidad de la cuenta demo coincide con el diseño |
| F2 | Capturas de 412 × 917 comparadas con `design/reference/` en claro, oscuro y texto al 200 % |
| F3 | La app funciona contra el backend desplegado (smoke test) |
| F4 | Informe Ionic vs nativo en un Android real de gama media |
