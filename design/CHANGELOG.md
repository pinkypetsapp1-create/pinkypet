# Cambios del diseño sincronizados

Cada entrada corresponde a una ejecución de `/sincronizar-diseno` (o a la copia inicial). Los sha256 de cada archivo están en `design.lock.json`.

## 2026-11-25 · DS 1795607040-66c8 / AF 1795607103-4583 · Mascota nueva: Donatello

Primera mascota añadida con `/nueva-mascota` (ficha en `mascotas/hechas/donatello.md`).
- **DS:** foto `assets/Fotos/donatello.jpg` (blob `af9341a8…`, recortada a 4:3 y ampliada a 1254 × 940 desde la original de 360 × 640); `design-system.json` y `assets/Fotos/README.md`.
- **AF:** Donatello en `Ficha` (D, FOTO y la opción `animal`), `Catalogo` (animals y FOTO) y `Main` (lista y FOTO); pantalla nueva `Ficha-Donatello`. El filtro de Ubicación de `Catalogo` ya usa la provincia de cada mascota (`prov`, Barcelona por defecto).
- **No se duplican** las copias Oscuro/Texto/Zoom ni las pantallas de estado por mascota.
- **Tokens:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-25 · DS 1795604949-7133 / AF 1795604953-aa22 · Ventanas de «Qué tiene en cuenta el test»

Observación del equipo: al pulsar cada caja de porcentaje, una ventana que explique el bloque, con el botón para hacer el test. Textos aprobados el 25-11-2026.
- **DS:** `Dialog/README.md` (variante «Bloque del test», informativa con acción); `ProgressRing/README.md` (la caja es un botón que abre su diálogo); `bundle.css` (`button.pp-ring-tile`).
- **AF:** `Main` con las cajas como botones y el diálogo de cada bloque (prop `info`); pantallas nuevas `Main-Info-Hogar`, `Main-Info-DiaADia` y `Main-Info-Mascota`; notas `nMain` y `nInfoBloques`; copia de `bundle.css` dentro de AF actualizada.
- **Tokens y assets:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-25 · DS 1795600951-f0b0 / AF 1795600954-b874 · Animación del logotipo al abrir la app

Observación del equipo: que la animación del logotipo salga cada vez que se abre la app.
- **DS:** `SplashPrimerInicio/README.md`: cada vez que se abre la app en Inicio, una vez por arranque (antes, solo la primera vez); sobre el Inicio del estado de la persona.
- **AF:** notas `t00` y `n00` del canvas.
- **Tokens, assets y CSS:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-25 · DS 1795600045-6224 / AF 1795600216-4a29 · Tarjetas en pantallas estrechas

Observación del equipo (OPPO Reno 13): «Ver compatibilidad» en dos líneas y «Necesidades especiales» fuera de la tarjeta. Opción A aprobada.
- **DS:** `components/bundle.css` (`.pp-animal-card .pp-tag` puede partir el texto: `max-width: 100%; white-space: normal`); `AnimalCard/README.md` (1 columna por debajo de 412 px); `Tag/README.md`.
- **AF:** pantalla nueva `Catalogo-360` (Mascotas a 360 px, 1 columna) con su nota; `TabBar` acepta un ancho (`ancho`, 412 px por defecto); `CatalogoTexto` y `CatalogoZoom` con la etiqueta que parte el texto, y `CatalogoZoom` en 1 columna; copia de `bundle.css` dentro de AF actualizada.
- **Tokens y assets:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-25 · DS 1795594555-9de7 / AF 1795594569-d2ff · Recuperar contraseña y «Repetir contraseña»

Cambio hecho por Claude en Claude Design con el OK del equipo (DS → Alta fidelidad → código).
- **Componentes (DS):** `Button/README.md` (botón de texto «¿Has olvidado tu contraseña?» y botones rellenos «Enviar enlace», «Volver a iniciar sesión», «Guardar contraseña», «Pedir un enlace nuevo»); `TextField/README.md` («Repetir contraseña», «Nueva contraseña», «Repite la contraseña.», «Las contraseñas no coinciden.»).
- **Pantallas nuevas (AF):** `Recuperar`, `Recuperar-Enviado`, `NuevaContrasena`, `NuevaContrasena-Hecha`, `NuevaContrasena-Caducado`, en la fila superior (x 6336–9504) con sus notas CONEXIONES.
- **Pantallas cambiadas (AF):** `Registro` (campo «Repetir contraseña» y resumen de hasta 3 campos), `Error-Registro-Campos` (3 campos), `Error-Registro-Existe`, `Login` y `Error-Login` («¿Has olvidado tu contraseña?»); notas `nLogin` y `nRegistro`.
- **Tokens y assets:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-24 · DS 1795509334-bb26 / AF 1795509349-ff9d · «Cerrar sesión» (F2-4)

Cambio hecho por Claude en Claude Design con el OK del equipo, en el orden de la regla: DS → Alta fidelidad → código.
- **Componentes (DS):** `components/Button/README.md` añade el botón de texto con icono `logout` «Cerrar sesión» (tarjeta «Mi cuenta» de Mi perfil). `design-system.json` solo cambia `lastChange`.
- **Pantallas (AF):** `PerfilCompletado.dc.html` añade «Cerrar sesión» bajo el correo, en «Mi cuenta». `PerfilVacio.dc.html` añade la tarjeta «Mi cuenta» (correo + «Cerrar sesión») cuando la persona está registrada sin test.
- **Flujos (AF):** notas CONEXIONES `nPerfilC` y `nPerfilR`: «Cerrar sesión → Inicio · sin cuenta». `canvas.json` se guardó en formato compacto (mismo contenido).
- **Tokens, assets, textos existentes:** sin cambios. Coherencia DS ↔ AF: OK.

## 2026-11-23 · Copia inicial (Fase 0) · DS 1795433635-941c / AF 1795433636-1cea

- **Design System** «Pinky Pet · Design System M3 Expressive», versión `1795433635-941c`: README, tokens.json, design-system.json, `components/bundle.css`, 41 componentes (README + preview; `Cover` solo tiene preview) y 12 assets (Logotipo 4, Ilustraciones 2, Fotos 6) con los README de cada grupo.
- **Alta fidelidad** «Pinky Pet · Alta fidelidad», versión `1795433636-1cea`: `canvas.json` y 106 `*.dc.html`.
- **Coherencia:** `tokens.json` y `bundle.css` son idénticos en los dos artifacts (sha256 `1fee07b9…` y `49db8b90…`). El registro de Alta fidelidad dice que copió la versión `1795026227-9d5e` del DS, pero el contenido coincide.
- **Versiones de partida:** `docs/PROMPT-INICIAL.md` cita DS `1795026228-d284` y AF `1795162665-6a50`. Cuando se hizo la copia ya había versiones posteriores publicadas, y el equipo decidió copiar las actuales.
- **Sin copiar:** `project/canvas.json` del DS (cita boards que ya no existen) y la copia del DS dentro de AF (`project/ds/`, idéntica).
- **Pendiente:** capturas de referencia en `reference/`.
