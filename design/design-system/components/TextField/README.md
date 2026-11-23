# TextField
Campo de texto outlined de 56 px con la etiqueta sobre el borde, siempre visible.

## Estados
- **Normal**: borde de 1 px en `outline` y etiqueta en `on-surface-variant`.
- **Foco**: borde de 2 px en `primary` y etiqueta en `primary`.
- **Error** (`pp-field--error`, `aria-invalid="true"`): borde de 2 px en `error`, icono `error` relleno a la derecha (relleno derecho de 52) y etiqueta y ayuda en `error`.

## Textos del wireframe
- «Correo electrónico» / «Contraseña».
- «Escribe un correo completo, por ejemplo nombre@correo.com.»
- «La contraseña debe tener al menos 8 caracteres. Ahora tiene 6.»
- «Escribe tu contraseña.»
- «Por seguridad, vuelve a escribir tu contraseña.» (ayuda neutra)

## Accesibilidad
`<label for>` real, ayuda o error enlazados con `aria-describedby` y `autocomplete` (`email`, `current-password`, `new-password`).

## Tokens
`outline`, `primary`, `error`, `on-surface`, `on-surface-variant`, `surface`, `corner-extra-small`.

## Fuente
Wireframe de fidelidad media: Login, Registro y sus estados de error.
