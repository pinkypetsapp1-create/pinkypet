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

## Estructura

```
design/   copia del diseño (DS + Alta fidelidad), solo lectura · design.lock.json · CHANGELOG.md
docs/     SPEC.md · design-map.md · design-feedback.md · PROMPT-INICIAL.md
scripts/  generate-tokens.mjs · design-lock.mjs
backend/  NestJS + MongoDB (Fase 1)
app/      Ionic + Angular standalone + Capacitor (Fase 2); app/src/theme/tokens.css es generado
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
