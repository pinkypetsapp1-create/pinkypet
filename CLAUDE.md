# Pinky Pet

Proyecto académico de UX/UI: app Android (Ionic + Angular + Capacitor) con un backend en NestJS + MongoDB, para valorar la compatibilidad entre una persona y una mascota antes de adoptarla. El equipo es de diseño: explica cada decisión técnica en español claro y en pocas líneas. La interfaz va en castellano.

Especificación completa: `docs/SPEC.md`. Mapa diseño → código: `docs/design-map.md`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run tokens` | Genera `app/src/theme/tokens.css` a partir de `design/design-system/tokens.json` |
| `npm test` | Tests de los scripts (tokens) |
| `npm run design:lock -- --check` | Comprueba que `design/` coincide con `design/design.lock.json` |
| `/sincronizar-diseno` | Trae los cambios de Claude Design (solo la lanza el equipo) |
| `/nueva-mascota` | Añade la mascota de `mascotas/nueva-mascota.md` (+ su foto en `mascotas/fotos/`) al diseño, la app, el servidor y las bases de datos (solo la lanza el equipo) |
| `npm run capturas -- 2a\|2b\|2c` | Capturas de la app (claro, oscuro, 206 px) en `docs/evidencia/<entrega>/`; necesita API y app arrancadas |
| `npm run comparar -- design/_incoming/reference docs/evidencia/<entrega>` | Diseño y app lado a lado en `docs/evidencia/<entrega>/comparacion/` |

App (desde `app/`): `npx ng serve --port 8100` (usa la API de `localhost:3000`) · `npm run api:types` regenera los tipos desde `backend/openapi.json`.

Backend (desde `backend/`; configuración en `backend/.env`, plantilla en `.env.example`):

| Comando | Qué hace |
|---|---|
| `npm run dev:mem` | API con MongoDB en memoria y el seed hecho (sin Atlas); Swagger en `/docs` |
| `npm run start:dev` | API contra `MONGODB_URI`, recargando al guardar |
| `npm test` · `npm run test:e2e` | Tests unitarios · e2e (MongoDB en memoria) |
| `npm run seed` | Mascotas, preguntas y 3 cuentas demo (idempotente) |
| `npm run mascota:leer -- <ficha>` | Comprueba una ficha de mascota nueva (`--escribir` la añade a `pets.data.ts`) |
| `npm run mascotas:subir` | Sube las mascotas a `MONGODB_URI` sin tocar cuentas ni disponibilidad |
| `npm run openapi` | Regenera `backend/openapi.json` (contrato para la app) |
| `npm run demo:resolve -- <id> finalizada\|rechazada` | Simula la respuesta de la protectora (solo desarrollo) |
| `npm run smoke -- <url>` | Prueba básica contra el backend publicado (Fase 3) |

Despliegue (Render + Atlas + Google + APK): `docs/DEPLOY.md` · `render.yaml`.

## Estructura

```
design/   copia del diseño (DS + Alta fidelidad), solo lectura · design.lock.json · CHANGELOG.md
docs/     SPEC.md · design-map.md · design-feedback.md · PROMPT-INICIAL.md
scripts/  generate-tokens.mjs · design-lock.mjs
backend/  NestJS + MongoDB · src/compatibility/rules.ts (cálculo) · src/seed/pets.data.ts (datos del diseño) · openapi.json
app/      Ionic + Angular standalone + Capacitor · src/app/{core,ui,pages} · src/theme/{tokens,ds-bundle}.css y assets/{fotos,ilustraciones} son generados
```

## Reglas de oro

1. `design/` es de solo lectura, salvo dentro de `/sincronizar-diseno`.
2. Colores, tipografía, formas, espaciados y movimiento salen solo de los tokens generados (y del movimiento de `bundle.css`). Nada a mano.
3. Los textos de la interfaz son los literales del diseño.
4. El código no cambia el diseño. Si algo del diseño no se puede implementar bien, apúntalo en `docs/design-feedback.md` y avisa.
5. Una sola solicitud activa por persona, garantizado en el backend.
6. Ningún secreto en el repositorio ni en el chat (`.env` está ignorado; cada `.env.example`, a partir de la Fase 1, lleva las claves vacías).
7. Cada fase termina con evidencia y commit, y espera la aprobación del equipo.

Prioridad de fuentes: el Design System para lo visual, después Alta fidelidad para pantallas, textos y flujos, y por último `docs/SPEC.md`. Nunca uses «Fidelidad media» ni otros artifacts. La semilla `#8E607C` no es `primary` (`#734863`): es correcto y no se «corrige».
