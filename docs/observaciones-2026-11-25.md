# Observaciones del equipo · 25-11-2026

Observaciones encontradas al probar la app. Recordatorio de la regla 4 de `CLAUDE.md`: **todo cambio visual se hace primero en el Design System, después en Alta fidelidad y por último en el código**, y se enseña al equipo antes de programarlo.

---

## 1. «¿Has olvidado tu contraseña?» → correo para cambiar la contraseña · ✅ resuelto

**Qué queremos:** desde Iniciar sesión, la persona pide un correo y, con el enlace que recibe, cambia su contraseña.

**Estado:**
- Diseño: hecho en Claude Design (DS `1795594555-9de7` / AF `1795594569-d2ff`). Pantallas `Recuperar`, `Recuperar-Enviado`, `NuevaContrasena`, `NuevaContrasena-Hecha` y `NuevaContrasena-Caducado`, y «Repetir contraseña» en `Registro`.
- Backend: hecho (commit `d15c4ce`). Endpoints `POST /auth/password/forgot`, `GET` y `POST /auth/password/reset`. El enlace caduca en 1 hora y solo sirve una vez.

**Pendiente:**
1. Que el equipo apruebe el diseño y los textos.
2. Programar en la app:
   - el enlace en Login;
   - las páginas `/recuperar` y `/nueva-contrasena?token=…`;
   - el campo «Repetir contraseña» en Registro.
3. El equipo crea la cuenta de Brevo y pega `BREVO_API_KEY` y `MAIL_FROM` en Render (`docs/DEPLOY.md`, apartado 3 bis). La clave nunca va en el chat.
4. Prueba real: el correo llega con el asunto «Crea una contraseña nueva para Pinky Pet» y el enlace abre «Nueva contraseña» en `https://pinky-pet-app.onrender.com`.

**Evidencia:** capturas del flujo completo (claro, oscuro y 206 px) y comparación con el diseño.

---

## 2. Móvil OPPO Reno 13 · ✅ resuelto (opción A: 1 columna por debajo de 412 px): «Ver compatibilidad» en dos líneas y la etiqueta «Necesidades especiales» se sale de la tarjeta

**Dónde:** «Mis mascotas compatibles» y el catálogo, en la tarjeta `pp-animal-card` (`app/src/app/ui/animal-card.ts`). El botón es tonal S y la etiqueta es `pp-tag`.

**Qué pasa:** en ese móvil (pantalla algo más estrecha que el lienzo de 412 px o letra del sistema más grande):
- el texto del botón «Ver compatibilidad» se parte en dos líneas;
- la etiqueta «Necesidades especiales» es más ancha que la tarjeta y se sale.

**Qué queremos:** que los dos se ajusten solos al ancho de la tarjeta, sin salirse y sin partir el botón cuando haya sitio.

**Pasos:**
1. Reproducir: en Chrome, vista de móvil a 360 px y 393 px, letra al 100 % y al 130 %. Si se puede, mirar también en el Reno 13 qué tamaño de letra tiene en *Ajustes → Pantalla*.
2. Comprobar qué dice el diseño de la tarjeta (`AnimalCard` en el DS y `CatalogoTexto` / `CatalogoZoom` en AF) para pantallas estrechas y letra grande.
   - Si ya lo resuelve (por ejemplo, la etiqueta puede partirse en dos líneas o el botón puede ocupar todo el ancho), el fallo es del código y se corrige solo en el código.
   - Si no lo resuelve, se propone el cambio primero en el DS → AF, se enseña al equipo y se apunta en `docs/design-feedback.md`.
3. Regla del DS que hay que respetar (ACC1): el botón nunca se encoge y crece hacia abajo si no cabe. Nada puede salirse de la tarjeta.

**Evidencia:** capturas a 360, 393 y 412 px, antes y después.

---

## 3. Animación del logotipo cada vez que se abre la app

**Ahora:** la animación del logotipo (`pp-splash`, `app/src/app/ui/splash.ts`) solo sale **la primera vez** que se abre la app (se guarda en `localStorage` que ya se vio) y solo en Inicio.

**Qué queremos:** que salga **cada vez que se abre la app**: al arrancarla de cero, no al volver de otra pestaña dentro de la app.

**Pasos:**
1. Mirar en Alta fidelidad la nota CONEXIONES de la animación de entrada:
   - si dice «solo la primera vez», cambiarla antes en AF y enseñarla al equipo;
   - si no dice nada, apuntar la decisión en `docs/design-feedback.md`.
2. En el código: quitar la marca de «ya vista» y mostrarla al arrancar la app (en `main.ts` / `app.component`, mientras se restaura la sesión), y no solo en Inicio.
3. Mantener lo que ya hace bien:
   - no sale si el móvil tiene activado «Reducir movimiento»;
   - se puede saltar tocando la pantalla;
   - dura lo mismo que en el diseño.

**Evidencia:** grabación (GIF) al abrir la app dos veces seguidas.

---

## 4. «Qué tiene en cuenta el test»: ventana emergente al pulsar cada porcentaje

**Dónde:** Inicio, sección «Qué tiene en cuenta el test», con las 3 cajas de anillo: «Mi hogar» 34 %, «Mi día a día» 33 % y «La mascota que busco» 33 % (`app/src/app/pages/inicio/inicio.page.html`, `bloques` en `inicio.page.ts`).

**Qué queremos:** al pulsar cada caja se abre una ventana emergente (Dialog del DS) con:
- el título del bloque;
- un texto que explique por qué es importante ese bloque para la compatibilidad, de qué van sus 5 preguntas y por qué pesa ese porcentaje en el test;
- debajo, el botón «Hacer el test de compatibilidad» (lleva al Test) y una forma de cerrar la ventana.

Lo mismo en las 3 cajas.

**Pasos:**
1. **Diseño primero:**
   - en el DS, añadir al README de `Dialog` (y al de la caja de anillo) la variante «informativa con acción»;
   - en AF, crear los 3 artboards (`Main-Info-Hogar`, `Main-Info-DiaADia`, `Main-Info-Mascota`) y actualizar la nota CONEXIONES de Main.
2. **Textos:** Claude propone los 3 textos a partir de las 15 preguntas reales del test (`docs/SPEC.md` y `Test.dc.html`) y el equipo los aprueba.
   - Ejemplo para Hogar: el tipo de vivienda, el espacio y con quién vive la persona deciden si una mascota puede estar bien en casa.
3. **Por qué 34 % y no 33 %:** los 3 bloques tienen 5 preguntas cada uno. El 34 % es solo el redondeo para que la suma dé 100 %. Hay que decidir con el equipo si el texto lo explica así o si se muestra «⅓ del test».
4. **Accesibilidad:**
   - cada caja pasa a ser un botón (hoy es `role="img"`), con un área táctil mínima de 48 px y un `aria-label` como «Mi hogar, 34 % del test. Ver qué preguntas incluye»;
   - la ventana devuelve el foco a la caja al cerrarse;
   - funciona con letra al 200 % y en modo oscuro.
5. **Botón según el estado:** si la persona ya hizo el test, el botón dice lo que indique el diseño (por ejemplo, «Revisar mis respuestas»). Se decide en AF.

**Evidencia:** capturas de las 3 ventanas (claro, oscuro y 206 px) y comparación con el diseño.

---

## Orden propuesto

1. Terminar «Olvidé mi contraseña» (punto 1): ya está diseñado y con el backend hecho.
2. Corregir la tarjeta en pantallas estrechas (punto 2): es un fallo visible.
3. Animación al abrir (punto 3): es un cambio pequeño.
4. Ventanas de «Qué tiene en cuenta el test» (punto 4): necesita diseño y textos nuevos.

Cada punto termina con evidencia y commit, y espera el OK del equipo.
