---
name: nueva-mascota
description: Añade una mascota nueva a partir de mascotas/nueva-mascota.md y su foto. La lleva al diseño (DS → Alta fidelidad), a la app, al servidor y a la base de datos local y de Atlas, y la publica. Solo la lanza el equipo.
disable-model-invocation: true
---

# /nueva-mascota

Lleva una mascota nueva a todas partes, siempre en el orden de las reglas de oro: **diseño → código → base de datos → publicación**.

| Artifact | URL |
|---|---|
| Design System (DS) | https://claude.ai/artifact/FdYKiHu4B9TE7YT6tG8ErF |
| Alta fidelidad (AF) | https://claude.ai/artifact/1MwUAQpwJFExpLby6g9vH2 |

Explica cada paso al equipo en castellano claro y en pocas líneas. **Para dos veces y espera el OK**: después del paso 1 (resumen de la ficha) y después del paso 4 (ficha y tarjeta en el diseño).

## 1. Leer y comprobar la ficha

1. `cd backend && npm run -s mascota:leer -- ../mascotas/nueva-mascota.md`.
   - Si hay problemas, enséñalos tal cual y para: el equipo corrige la ficha y vuelve a lanzar `/nueva-mascota`.
2. Comprueba la foto (`mascotas/fotos/<archivo>`): JPG horizontal, más o menos 4:3, entre 1200 y 1400 px de ancho, menos de 300 KB. Si es mayor, redúcela con `sips` en una copia del scratchpad (`sips -Z 1365`). No cambies el original.
3. Revisa los textos con criterio: ortografía, punto final igual que las demás mascotas y que «Motivo corto» quepa en la tarjeta. **Cualquier corrección se propone, no se aplica.**
4. Enseña al equipo un resumen: nombre, datos, textos y el % que tendrá la cuenta demo, con los tres bloques. **Espera el OK.**

## 2. Design System: la foto

1. Lee el DS (`Artifact read`, `paths: ["project/design-system.json", "project/assets/Fotos/README.md"]`).
2. Sube la foto como asset del DS (`publish` con `url` del DS, `asset: true` y la foto con el nombre `<slug>.jpg`). Guarda su `id`.
3. Añade la foto al grupo `Fotos` de `design-system.json`: añádela a `order` y a `files` con `{name, blob: <id>, size, type: "image/jpeg"}`, siguiendo a las demás. Pon `lastChange` («Mascota nueva: <Nombre>»).
4. Añade la foto a la lista de `assets/Fotos/README.md`.
5. Publica `design-system.json` **el último**, después de leerlo otra vez justo antes.

## 3. Alta fidelidad: ficha, tarjeta y carrusel

1. Sube la misma foto como asset de AF (`asset: true`). Su `url` es la que va en los `FOTO` (las demás usan `/_blob/<id>`).
2. Lee y edita en el scratchpad, pegando los fragmentos que da `mascota:leer`:
   - `Ficha.dc.html`: la entrada en `D` (al final) y en `FOTO`.
   - `Catalogo.dc.html`: la entrada en `animals` (al final) y en `FOTO`.
   - `Main.dc.html`: la entrada en `lista` y en `FOTO`.
   - Una instancia nueva `Ficha-<Nombre>.dc.html` (copia de `Ficha-Simba.dc.html` con `animal="<slug>"` y su `<title>`).
   - `canvas.json`: el artboard de la instancia, en un hueco libre de la fila de las otras fichas (y = 2634), sin tapar nada.
3. Las copias Oscuro/Texto/Zoom y las pantallas por mascota (`Compatibles-Limite-*`, `Estado-*`, `Solicitud-*`, `ComoAdoptar-Sesion-*`) **no** se duplican: son pruebas de los estados de las seis originales. Dilo en el resumen.
4. Publica AF (`canvas.json` el último).

## 4. Revisar en Claude Design y esperar el OK

1. Abre en Chrome `#play-Ficha-<Nombre>` y `#play-Catalogo` y comprueba que la foto y los textos se ven bien.
2. Guarda las capturas en `design/_incoming/reference/` y enséñalas al equipo. **Espera el OK.**

## 5. Sincronizar y llevarla al código

1. Copia a `design/` los archivos cambiados, incluida la foto en `design/design-system/assets/Fotos/<slug>.jpg`.
2. Actualiza el manifiesto remoto y comprueba el lock: `node scripts/design-lock.mjs --remote <manifiesto>` debe dar **0 discrepancias**. Añade la entrada en `design/CHANGELOG.md`.
3. `npm run tokens`: copia la foto a `app/src/assets/fotos/`.
4. `cd backend && npm run -s mascota:leer -- ../mascotas/nueva-mascota.md --escribir`: añade la mascota a `src/seed/pets.data.ts`.
5. Comprueba que no hay ningún texto a mano en la app: las mascotas salen del servidor.
6. Pasa todo: `npm test` (raíz), `cd backend && npm test && npm run test:e2e` y `cd app && npx ng build`. Si algo falla, para y explícalo.

## 6. Base de datos

- **Local:** reinicia `npm run dev:mem`; carga sola las mascotas de `pets.data.ts`.
- **Atlas:** `cd backend && npm run mascotas:subir`. Usa `MONGODB_URI` de `backend/.env`.
  - Si no existe `backend/.env`, guía al equipo para crearlo a partir de `backend/.env.example`: la contraseña la pega el equipo en el archivo, **nunca en el chat**.
  - `mascotas:subir` no toca cuentas ni solicitudes, y no vuelve a poner como disponibles las mascotas ya adoptadas. **No uses `npm run seed`** para esto.

## 7. Evidencia, commit y publicación

1. Captura en local Mascotas y la ficha nueva (claro, oscuro y 206 px) en `docs/evidencia/mascotas/<slug>/`.
2. Mueve la ficha rellenada a `mascotas/hechas/<slug>.md` y la foto a `mascotas/hechas/fotos/`. Deja `mascotas/nueva-mascota.md` otra vez en blanco: cópiala de `mascotas/PLANTILLA.md`.
3. Dos commits, igual que siempre: `design: sync …` y `feat: mascota nueva <Nombre>`.
4. `git push`: Render vuelve a publicar la API y la web. Si no hay credenciales de GitHub, pide al equipo que haga el push.
5. Cuando Render termine, comprueba que `https://pinky-pet-api.onrender.com/pets` incluye la mascota y que su foto se ve en la web.
6. Resumen final: qué se ha cambiado y dónde, y las URL para verla.
