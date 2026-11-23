# Feedback al diseño

Aquí se apuntan las cosas del diseño que no se pueden implementar tal cual o que conviene revisar en Claude Design. **El código no cambia el diseño:** cada punto se resuelve primero en el Design System, después en Alta fidelidad y, por último, en el código.

Estados posibles: `abierto` · `resuelto en DS <versión>` · `aceptado tal cual`.

| # | Dónde | Qué pasa | Propuesta | Estado |
|---|---|---|---|---|
| F0-1 | `bundle.css`, línea 1 | Carga Roboto y Material Symbols desde Google Fonts con `@import`. La app tiene que funcionar sin red y con las fuentes empaquetadas. Además, **Fraunces no está** en ese `@import`: solo la cargan las pantallas de Alta fidelidad y las previews. | En la app, quitar el `@import` al compilar (sin tocar `design/`) y servir las tres fuentes desde los assets. En el DS: añadir Fraunces al `@import` o documentar que lo pone quien consume el sistema. | abierto |
| F0-2 | `bundle.css`, todos los componentes | Los tamaños de letra están en `px` (`font: 500 16px/24px …`). Con «Texto 200 %» el WebView de Android escala el texto con `textZoom`, pero hay que comprobar que no se corte nada. | Verificarlo en la Fase 2 con las capturas «Texto 200 %». Si falla, pasar a `rem` en el DS. | abierto (verificar en F2) |
| F0-3 | `tokens.json` / `bundle.css` | Las curvas y duraciones del movimiento (`--pp-ease-*`, `--pp-dur-*`) están en `bundle.css` y no en `tokens.json`, porque el formato de tokens no admite movimiento. | Aceptarlo: el código las toma de `bundle.css`, que también es del DS. | aceptado tal cual |
| F0-4 | README del DS y cabecera de `bundle.css` | Siguen diciendo «Fuente de verdad: el wireframe de fidelidad media» y «extraídos del wireframe de fidelidad media». Los README de los componentes también citan la fidelidad media como «Fuente». | Actualizar esas notas en el DS. Mientras tanto manda el orden de prioridad de `docs/SPEC.md`. | abierto |
| F0-5 | `project/canvas.json` del DS | Cita 5 boards (`Main`, `Fundamentos`, `Acciones`, `Contenedores`, `Feedback.dc.html`) que ya no existen en el artifact. | Borrarlo o rehacerlo en el DS. No se copia a `design/`. | abierto |
| F0-6 | Assets de Alta fidelidad | Las pantallas usan sus propias copias de las fotos y las ilustraciones (con otros ids de blob), pero son **idénticas byte a byte** a las del DS. Hay además un PNG huérfano (`41daad09…`, 30 628 bytes) que no usa ninguna pantalla. | Ninguna para la app: usa los assets del DS. En AF se puede borrar el huérfano. | aceptado tal cual |
