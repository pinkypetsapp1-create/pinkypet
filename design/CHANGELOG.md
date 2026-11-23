# Cambios del diseño sincronizados

Cada entrada corresponde a una ejecución de `/sincronizar-diseno` (o a la copia inicial). Los sha256 de cada archivo están en `design.lock.json`.

## 2026-11-23 · Copia inicial (Fase 0) · DS 1795433635-941c / AF 1795433636-1cea

- **Design System** «Pinky Pet · Design System M3 Expressive», versión `1795433635-941c`: README, tokens.json, design-system.json, `components/bundle.css`, 41 componentes (README + preview; `Cover` solo tiene preview) y 12 assets (Logotipo 4, Ilustraciones 2, Fotos 6) con los README de cada grupo.
- **Alta fidelidad** «Pinky Pet · Alta fidelidad», versión `1795433636-1cea`: `canvas.json` y 106 `*.dc.html`.
- **Coherencia:** `tokens.json` y `bundle.css` son idénticos en los dos artifacts (sha256 `1fee07b9…` y `49db8b90…`). El registro de Alta fidelidad dice que copió la versión `1795026227-9d5e` del DS, pero el contenido coincide.
- **Versiones de partida:** `docs/PROMPT-INICIAL.md` cita DS `1795026228-d284` y AF `1795162665-6a50`. Cuando se hizo la copia ya había versiones posteriores publicadas, y el equipo decidió copiar las actuales.
- **Sin copiar:** `project/canvas.json` del DS (cita boards que ya no existen) y la copia del DS dentro de AF (`project/ds/`, idéntica).
- **Pendiente:** capturas de referencia en `reference/`.
