# Cambios del diseño sincronizados

Cada entrada corresponde a una ejecución de `/sincronizar-diseno` (o a la copia inicial). Los sha256 de cada archivo están en `design.lock.json`.

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
